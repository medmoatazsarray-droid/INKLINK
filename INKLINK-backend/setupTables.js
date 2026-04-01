const db = require('./config/db');

const queries = [
  `CREATE TABLE IF NOT EXISTS categories (
        id_categorie INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS artistes (
        id_artiste INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS produit (
        id_produit INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        description TEXT,
        prixBase DECIMAL(10,2),
        stock INT,
        id_categorie INT,
        id_artiste INT,
        statutProduction VARCHAR(50),
        template VARCHAR(10),
        image VARCHAR(255),
        FOREIGN KEY (id_categorie) REFERENCES categories(id_categorie) ON DELETE SET NULL,
        FOREIGN KEY (id_artiste) REFERENCES artistes(id_artiste) ON DELETE SET NULL
    )`,
  `INSERT INTO categories (nom) SELECT * FROM (SELECT 'Bijoux') AS tmp WHERE NOT EXISTS (SELECT nom FROM categories WHERE nom = 'Bijoux') LIMIT 1`,
  `INSERT INTO categories (nom) SELECT * FROM (SELECT 'Accessoires') AS tmp WHERE NOT EXISTS (SELECT nom FROM categories WHERE nom = 'Accessoires') LIMIT 1`,
  `INSERT INTO categories (nom) SELECT * FROM (SELECT 'Vêtements') AS tmp WHERE NOT EXISTS (SELECT nom FROM categories WHERE nom = 'Vêtements') LIMIT 1`,
  `INSERT INTO artistes (nom) SELECT * FROM (SELECT 'Med Moataz') AS tmp WHERE NOT EXISTS (SELECT nom FROM artistes WHERE nom = 'Med Moataz') LIMIT 1`,
  `INSERT INTO artistes (nom) SELECT * FROM (SELECT 'Étincelle Studio') AS tmp WHERE NOT EXISTS (SELECT nom FROM artistes WHERE nom = 'Étincelle Studio') LIMIT 1`
];

const runQuery = (q) => {
  return new Promise((resolve, reject) => {
    db.query(q, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

async function setup() {
  for (const q of queries) {
    try {
      await runQuery(q);
      console.log('Query executed successfully');
    } catch (e) {
      console.error('Query failed:', e.message);
    }
  }
  db.end();
}

setup();
