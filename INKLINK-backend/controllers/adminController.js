const Admin = require('../routes/models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../services/emailService');

const isAuthDebugEnabled = () =>
    String(process.env.DEBUG_AUTH || '').toLowerCase() === '1' ||
    String(process.env.DEBUG_AUTH || '').toLowerCase() === 'true';

exports.login = (req, res) => {
    const { username, password } = req.body;
    const identifier = String(username || '').trim();
    if (!identifier || !password) {
        return res.status(400).json({ message: 'username and password are required' });
    }

    Admin.findByIdentifier(identifier, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (isAuthDebugEnabled()) {
            console.log('[auth] identifier:', identifier);
            console.log('[auth] candidates:', results.map((r) => r && r.id_admin).filter(Boolean));
        }

        const tryCandidate = (index) => {
            if (index >= results.length) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const admin = results[index];
            const passwordHash =
                typeof admin.password === 'string' ? admin.password.trim() : admin.password;

            if (isAuthDebugEnabled()) {
                const hashPreview =
                    typeof passwordHash === 'string' ? passwordHash.slice(0, 7) : typeof passwordHash;
                let rounds = null;
                try {
                    rounds = bcrypt.getRounds(passwordHash);
                } catch {
                    rounds = null;
                }
                console.log('[auth] trying admin.id_admin:', admin.id_admin, 'user:', admin.username);
                console.log('[auth] hashPreview:', hashPreview, 'len:', String(passwordHash || '').length, 'rounds:', rounds);
            }

            bcrypt.compare(password, passwordHash, (compareErr, isMatch) => {
                if (compareErr) {
                    console.error('Bcrypt error:', compareErr);
                    return res.status(500).json({ message: 'Password comparison error' });
                }
                if (!isMatch) {
                    return tryCandidate(index + 1);
                }

                const token = jwt.sign(
                    {id : admin.id_admin, username : admin.username, role : admin.role},
                    process.env.JWT_SECRET || 'your_secret_key',
                    {expiresIn : '1h'}
                );
                return res.status(200).json({ message: 'login successful', token: token, admin: {
                    id : admin.id_admin,
                    username : admin.username,
                    role : admin.role,
                    email: admin.email ?? null,
                    profile_image: admin.profile_image ?? null
                }});
            });
        };

        return tryCandidate(0);
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({message : 'Email is required'});
    }
    Admin.findByEmail(email, async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({message : 'Database error'});
        }
        if (results.length === 0) {
            // For security, don't reveal if email exists
            return res.status(200).json({message : 'If the email exists, a reset link has been sent'});
        }
        const admin = results[0];
        const resetToken = jwt.sign(
            {id : admin.id_admin, email : admin.email, purpose: 'password-reset'},
            process.env.JWT_SECRET || 'your_secret_key',
            {expiresIn : '15m'}
        );
        
        try {
            const emailResult = await sendPasswordResetEmail(email, resetToken);
            console.log('Password reset email sent to:', email);
            console.log('Preview URL:', emailResult.previewUrl);
            res.status(200).json({
                message : 'Email envoyé ! Vérifiez votre boîte de réception.',
                previewUrl: emailResult.previewUrl
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.status(500).json({message : 'Error sending email'});
        }
        
    });
};

exports.verifyResetToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        if (payload.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Invalid token purpose' });
        }
        return res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    const newPasswordStr = String(newPassword);
    if (newPasswordStr.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    if (newPasswordStr.trim() !== newPasswordStr) {
        return res.status(400).json({ message: 'Password cannot start or end with spaces' });
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (payload.purpose !== 'password-reset' || !payload.id) {
        return res.status(400).json({ message: 'Invalid token purpose' });
    }

    bcrypt.hash(newPasswordStr, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
            console.error('Bcrypt hash error:', hashErr);
            return res.status(500).json({ message: 'Error hashing password' });
        }

        Admin.updatePasswordById(payload.id, hashedPassword, (dbErr, result) => {
            if (dbErr) {
                console.error('Database error:', dbErr);
                return res.status(500).json({ message: 'Database error' });
            }

            if (!result || result.affectedRows === 0) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            Admin.findById(payload.id, (findErr, rows) => {
                if (findErr) {
                    console.error('Database error:', findErr);
                    return res.status(500).json({ message: 'Database error' });
                }

                const admin = rows && rows[0];
                const storedHash =
                    admin && typeof admin.password === 'string' ? admin.password.trim() : admin && admin.password;

                bcrypt.compare(newPasswordStr, storedHash, (compareErr, ok) => {
                    if (compareErr) {
                        console.error('Bcrypt error:', compareErr);
                        return res.status(500).json({ message: 'Password reset verification failed' });
                    }
                    if (!ok) {
                        console.error('Password reset verification failed for admin id:', payload.id);
                        return res.status(500).json({ message: 'Password reset verification failed' });
                    }

                    if (isAuthDebugEnabled()) {
                        console.log('[auth] reset ok for admin.id_admin:', payload.id, 'affectedRows:', result.affectedRows);
                    }

                    return res.status(200).json({ message: 'Password reset successful' });
                });
            });
        });
    });
};

exports.updateProfile = (req, res) => {
    const { username, email, password } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
    
    // In a real app, we'd get the admin ID from the JWT token
    // For now, since it's a single admin or we assume the first admin for test
    // But better to use the username from localStorage if sent, or just id 1
    // Let's assume we update the admin with id_admin = 1 for now if no auth is enforced
    // Or try to find by original username if sent
    
    // Better: let's use the ID from the token if possible.
    // However, the frontend isn't sending the token in the headers in the provided code.
    // I should check if there's a middleware or if I should add it.
    
    let idAdmin = 1;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.slice(7).trim();
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            if (payload && payload.id) idAdmin = payload.id;
        } catch {
            // ignore invalid token; keep fallback idAdmin = 1
        }
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profileImage) updateData.profile_image = profileImage;
    
    const proceedWithUpdate = (data) => {
        Admin.updateProfile(idAdmin, data, (err, result) => {
            if (err) {
                console.error('Update error:', err);
                const details = err.code || err.message;
                if (
                    data &&
                    data.profile_image &&
                    (details === 'ER_BAD_FIELD_ERROR' || String(details).toLowerCase().includes('unknown column'))
                ) {
                    const retryData = { ...data };
                    delete retryData.profile_image;
                    return Admin.updateProfile(idAdmin, retryData, (retryErr) => {
                        if (retryErr) {
                            console.error('Update retry error:', retryErr);
                            return res.status(500).json({
                                message: 'Error updating profile',
                                ...(process.env.NODE_ENV !== 'production'
                                    ? { details: retryErr.code || retryErr.message }
                                    : {})
                            });
                        }
                        return res.status(200).json({
                            message: 'Profile updated successfully',
                            admin: { id: idAdmin, username, email, profile_image: profileImage }
                        });
                    });
                }
                return res.status(500).json({
                    message: 'Error updating profile',
                    ...(process.env.NODE_ENV !== 'production' ? { details: err.code || err.message } : {})
                });
            }
            Admin.findById(idAdmin, (findErr, rows) => {
                if (findErr) {
                    console.error('Database error:', findErr);
                    return res.status(500).json({ message: 'Database error' });
                }
                const admin = rows && rows[0];
                return res.status(200).json({
                    message: 'Profile updated successfully',
                    admin: admin
                        ? {
                            id: admin.id_admin,
                            username: admin.username,
                            email: admin.email ?? null,
                            profile_image: admin.profile_image ?? null
                        }
                        : { id: idAdmin, username, email, profile_image: profileImage }
                });
            });
        });
    };

    if (password && password.trim() !== '') {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });
            updateData.password = hash;
            proceedWithUpdate(updateData);
        });
    } else {
        proceedWithUpdate(updateData);
    }
};

exports.getProfile = (req, res) => {
    const idAdmin = 1; // Assuming default admin for now
    Admin.findById(idAdmin, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const admin = results[0];
        res.status(200).json({
            id: admin.id_admin,
            username: admin.username,
            email: admin.email,
            profile_image: admin.profile_image
        });
    });
};
