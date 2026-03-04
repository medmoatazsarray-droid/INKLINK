const nodemailer = require('nodemailer');

// Fallback test inbox used only when real SMTP is not configured.
async function getEtherealTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal test account created:');
    console.log('Email:', testAccount.user);
    console.log('Password:', testAccount.pass);
    console.log('Preview URL: https://ethereal.email/');

    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
}

function getSmtpTransporter() {
    const isPlaceholder = (value) => {
        const v = String(value || '').trim().toLowerCase();
        return !v || v === 'yourgmail@gmail.com' || v === 'your_16_char_gmail_app_password';
    };

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = String(process.env.SMTP_SECURE || 'false') === 'true';
    const primaryUser = (process.env.EMAIL_USER || '').trim();
    const fallbackUser = (process.env.SMTP_USER || '').trim();
    const primaryPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
    const fallbackPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    const smtpUser = !isPlaceholder(primaryUser) ? primaryUser : fallbackUser;
    const smtpPass = !isPlaceholder(primaryPass) ? primaryPass : fallbackPass;
    const isGmailUser = /@gmail\.com$/i.test(smtpUser);

    if (!smtpUser || !smtpPass) {
        return null;
    }

    // If host is not provided but credentials are Gmail, use Gmail service config.
    if (!smtpHost && isGmailUser) {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });
    }

    if (!smtpHost) {
        return null;
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
}

async function sendPasswordResetEmail(email, resetToken) {
    try {
        let transporter = getSmtpTransporter();
        let isTestTransport = false;
        const allowEtherealFallback = String(process.env.ALLOW_ETHEREAL_FALLBACK || 'false') === 'true';

        if (!transporter) {
            if (!allowEtherealFallback) {
                throw new Error('SMTP is not configured. Set SMTP_* or EMAIL_USER/EMAIL_PASS in .env');
            }
            transporter = await getEtherealTransporter();
            isTestTransport = true;
        }

        const resetLink = `http://localhost:4200/admin/reset-password?token=${encodeURIComponent(resetToken)}`;

        const mailOptions = {
            from: process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || 'noreply@inklink.local',
            to: email,
            subject: 'INKLINK - Reset your password',
            text: [
                'You requested a password reset for your INKLINK account.',
                '',
                `Open this link to reset your password: ${resetLink}`,
                '',
                'This link expires in 15 minutes.',
                'If you did not request this, ignore this email.'
            ].join('\n'),
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset your password</h2>
                    <p>You requested a password reset for your INKLINK account.</p>
                    <p>Click the button below:</p>
                    <p>
                        <a href="${resetLink}" style="background:#0d6efd;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;display:inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p>If the button does not work, copy and paste this link:</p>
                    <p><a href="${resetLink}">${resetLink}</a></p>
                    <p style="color:#666;font-size:12px;">This link expires in 15 minutes.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        const previewUrl = isTestTransport ? nodemailer.getTestMessageUrl(info) : null;

        console.log('Email sent successfully');
        console.log('Message ID:', info.messageId);
        if (previewUrl) {
            console.log('Preview URL:', previewUrl);
        }

        return {
            success: true,
            messageId: info.messageId,
            previewUrl
        };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = {
    sendPasswordResetEmail,
    getEtherealTransporter,
    getSmtpTransporter
};
