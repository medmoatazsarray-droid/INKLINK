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

  // Ensure optional columns exist for profile updates (dev convenience).
  const ensureProfileImageColumn = () => {
    const sql =
      "SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND LOWER(TABLE_NAME) = 'admin' AND COLUMN_NAME = 'profile_image'";
    db.query(sql, (checkErr, rows) => {
      if (checkErr) {
        console.error('Schema check failed:', checkErr.code || checkErr.message);
        return;
      }
      const cnt = rows && rows[0] && typeof rows[0].cnt !== 'undefined' ? Number(rows[0].cnt) : 0;
      if (cnt > 0) return;

      const alterCandidates = ['Admin', 'admin'];
      const tryAlter = (i) => {
        if (i >= alterCandidates.length) {
          console.error("Could not add 'profile_image' column (tried Admin/admin).");
          return;
        }
        const tableName = alterCandidates[i];
        db.query(
          `ALTER TABLE \`${tableName}\` ADD COLUMN profile_image VARCHAR(255) NULL`,
          (alterErr) => {
            if (alterErr) return tryAlter(i + 1);
            console.log("Added column 'profile_image' to table:", tableName);
          }
        );
      };
      tryAlter(0);
    });
  };

  ensureProfileImageColumn();
});

module.exports = db;
