const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'inklink',
});

db.connect((err) => {
  if (err) {
    const code = err.code || err.message;
    const hint =
      err.code === 'ER_BAD_DB_ERROR'
        ? ` (Database '${process.env.DB_NAME || 'inklink'}' not found. Create it in phpMyAdmin or import your SQL dump, then run \`npm run db:setup\` if needed.)`
        : err.code === 'ECONNREFUSED'
          ? ' (MySQL is not running. Start MySQL in XAMPP.)'
          : '';
    console.error(`DB connection failed: ${code}${hint}`);
    return;
  }
  console.log('DB connected successfully');
});

module.exports = db;
