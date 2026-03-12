const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'INKLINK-backend', '.env') });

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

  const tablesQuery = "SHOW TABLES";
  db.query(tablesQuery, (err, tables) => {
    if (err) throw err;
    console.log('Tables:', tables);

    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM produit) AS totalProduits,
        (SELECT COUNT(*) FROM artiste) AS totalArtistes,
        (SELECT COUNT(*) FROM commande) AS totalCommandes,
        (SELECT IFNULL(SUM(total), 0) FROM commande) AS totalRevenusRaw;
    `;
    db.query(statsQuery, (err, stats) => {
      if (err) {
          console.error('Stats query failed. Trying lowercase/singular variants...');
          db.query("SELECT COUNT(*) as count FROM Produit", (e,r) => console.log('Produit count:', e ? e.message : r[0].count));
          db.query("SELECT COUNT(*) as count FROM Artiste", (e,r) => console.log('Artiste count:', e ? e.message : r[0].count));
          db.query("SELECT COUNT(*) as count FROM Commande", (e,r) => console.log('Commande count:', e ? e.message : r[0].count));
      } else {
          console.log('Stats:', stats[0]);
      }
      db.end();
    });
  });
});
