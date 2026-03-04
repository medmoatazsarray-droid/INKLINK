const db = require('./config/db');
require('dotenv').config();

console.log('Adding email column to Admin table...');
const isPlaceholder = (value) => {
    const v = String(value || '').trim().toLowerCase();
    return !v || v === 'yourgmail@gmail.com';
};

const adminEmail = !isPlaceholder(process.env.ADMIN_EMAIL)
    ? process.env.ADMIN_EMAIL
    : (process.env.EMAIL_USER || process.env.SMTP_USER || 'admin@inklink.local');

function updateAdminEmail() {
    const updateQuery = 'UPDATE Admin SET email = ? WHERE id_admin = 1';
    db.query(updateQuery, [adminEmail], (updateErr) => {
        if (updateErr) {
            console.error('Error updating admin email:', updateErr);
            process.exit(1);
        }
        console.log(`Admin email updated to: ${adminEmail}`);
        db.query('SELECT id_admin, username, email FROM Admin', (selectErr, rows) => {
            if (selectErr) {
                console.error('Error fetching data:', selectErr);
                process.exit(1);
            }
            console.log('\n=== Admin Table ===');
            console.log(JSON.stringify(rows, null, 2));
            process.exit(0);
        });
    });
}

// First, check if email column already exists
db.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Admin' AND COLUMN_NAME = 'email'", (err, results) => {
    if (err) {
        console.error('Error checking for email column:', err);
        process.exit(1);
    }
    
    if (results && results.length > 0) {
        console.log('Email column already exists');
        updateAdminEmail();
        return;
    }
    
    // Add email column
    const alterQuery = 'ALTER TABLE Admin ADD COLUMN email VARCHAR(100) UNIQUE';
    db.query(alterQuery, (err) => {
        if (err) {
            console.error('Error adding email column:', err);
            process.exit(1);
        }
        console.log('Email column added successfully');
        
        updateAdminEmail();
    });
});
