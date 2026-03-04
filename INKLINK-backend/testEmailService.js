const { sendPasswordResetEmail } = require('./services/emailService');
require('dotenv').config();

console.log('Testing email service...\n');

const targetEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER || 'admin@inklink.local';

sendPasswordResetEmail(targetEmail, 'test-reset-token-12345')
    .then((result) => {
        console.log('\nEmail sent successfully!');
        console.log('Message ID:', result.messageId);

        if (result.previewUrl) {
            console.log('\nOpen this link in your browser to see the test inbox email:');
            console.log(result.previewUrl);
        } else {
            console.log('\nEmail was sent using your real SMTP provider (for example Gmail).');
        }

        process.exit(0);
    })
    .catch((err) => {
        console.error('Error sending email:', err.message);
        process.exit(1);
    });
