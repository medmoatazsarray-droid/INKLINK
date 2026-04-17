const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sarraymoataz_inklink',
});

db.connect((err) => {
  if (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }

  const query = `
    SELECT p.id_produit, p.nom, p.prixBase, c.nom AS category
    FROM produit p
    LEFT JOIN categorie c ON p.id_categorie = c.id_categorie
  `;
  db.query(query, (err, products) => {
    if (err) console.error(err);
    else console.log('Products:', products);

    db.query('SELECT * FROM categorie', (err, categories) => {
      if (err) console.error(err);
      else console.log('Categories:', categories);
      db.end();
    });
  });
});
