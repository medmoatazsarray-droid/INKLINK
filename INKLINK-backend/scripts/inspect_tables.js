const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

db.query("SHOW TABLES", (err, results) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Tables in', process.env.DB_NAME, ':', results);
    process.exit();
});
