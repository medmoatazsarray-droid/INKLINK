const Admin = require('../routes/models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../services/emailService');

exports.login = (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({message : 'username and password are required'});
    }
    Admin.findByUsername(username, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({message : 'Database error'});
        }
        if (results.length === 0) {
            return res.status(401).json({message : 'Admin not found'});
        }
        const admin = results[0];
        console.log('Admin found:', admin.username);
        bcrypt.compare(password, admin.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).json({message : 'Password comparison error'});
            }
            if (!isMatch) {
                console.log('Password mismatch for user:', admin.username);
                return res.status(401).json({message : 'incorrect password'});
            }
            const token = jwt.sign(
                {id : admin.id_admin, username : admin.username, role : admin.role},
                process.env.JWT_SECRET || 'your_secret_key',
                {expiresIn : '1h'}
            );
            res.status(200).json({message : 'login successful', token : token, admin : {
                id : admin.id_admin,
                username : admin.username,
                role : admin.role
            }});
        });
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

    if (String(newPassword).length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
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

    bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
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

            return res.status(200).json({ message: 'Password reset successful' });
        });
    });
};
