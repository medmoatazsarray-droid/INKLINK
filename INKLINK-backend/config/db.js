const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
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
  const ensureMessagesTable = () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS messages (
        id_message INT AUTO_INCREMENT PRIMARY KEY,
        id_artiste INT NOT NULL,
        id_utilisateur INT NULL,
        nom_utilisateur VARCHAR(100) NULL,
        email_utilisateur VARCHAR(255) NULL,
        contenu TEXT NOT NULL,
        lu TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_messages_artiste (id_artiste, lu, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;

    db.query(sql, (err) => {
      if (err) {
        console.error('Messages table setup failed:', err.message);
      } else {
        console.log('Messages table ready');
      }
    });
  };

  ensureMessagesTable();
});

module.exports = db;
