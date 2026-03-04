const db = require('./config/db');

// Check if Admin table has records
db.query('SELECT * FROM Admin', (err, results) => {
    if (err) {
        console.error('Database error:', err);
    } else {
        console.log('Admin records:', results);
    }
    process.exit();
});
