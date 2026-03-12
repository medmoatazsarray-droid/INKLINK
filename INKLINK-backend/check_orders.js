const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'inklink',
});

db.connect((err) => {
  if (err) throw err;
  db.query("SELECT statut, COUNT(*) as count, SUM(total) as total FROM commande GROUP BY statut", (err, res) => {
    console.log('Order Summary by Status:', res);
    db.end();
  });
});
