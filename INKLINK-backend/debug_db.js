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
    console.error('DB Connection error:', err);
    process.exit(1);
  }
  console.log('Checking tables...');
  db.query('SHOW TABLES', (err, tables) => {
    if (err) console.error(err);
    else console.log('Tables:', tables);

    console.log('Checking order 2...');
    db.query('SELECT * FROM commande WHERE id_commande = 2', (err2, order) => {
      if (err2) console.error(err2);
      else console.log('Order 2:', order);

      console.log('Checking utilisateur table...');
      db.query('SELECT * FROM utilisateur LIMIT 1', (err3, user) => {
          if (err3) console.error('Utilisateur table check failed:', err3.message);
          else console.log('Utilisateur table exists and has data');
          db.end();
      });
    });
  });
});
