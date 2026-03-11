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
                    role : admin.role
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
