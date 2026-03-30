require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');

db.query('SELECT p.*, c.nom as categorie_nom FROM produit p LEFT JOIN categorie c ON c.id_categorie = p.id_categorie', (err, results) => {
  if (err) {
    console.error('Query failed:', err);
    process.exit(1);
  }
  fs.writeFileSync('products_dump.json', JSON.stringify(results, null, 2));
  console.log('Dumped to products_dump.json');
  process.exit(0);
});
