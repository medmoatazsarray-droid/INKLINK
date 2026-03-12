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
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to', process.env.DB_NAME);

  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM produit) AS totalProduits,
      (SELECT COUNT(*) FROM artiste) AS totalArtistes,
      (SELECT COUNT(*) FROM commande) AS totalCommandes,
      (SELECT IFNULL(SUM(total), 0) FROM commande) AS totalRevenusRaw;
  `;
  db.query(statsQuery, (err, stats) => {
    if (err) {
        console.error('Stats query failed:', err.message);
    } else {
        console.log('Stats Result:', stats[0]);
    }
    db.end();
  });
});
