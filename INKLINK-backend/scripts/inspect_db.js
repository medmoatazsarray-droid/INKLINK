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

  db.query('SHOW TABLES', (err, tables) => {
    if (err) {
        console.error(err);
        db.end();
        return;
    }

    const tableList = tables.map(t => Object.values(t)[0]);
    console.log('Tables:', tableList);

    const describePromises = tableList.map(table => {
        return new Promise((resolve) => {
            db.query(`DESCRIBE \`${table}\``, (err, columns) => {
                resolve({ table, columns });
            });
        });
    });

    Promise.all(describePromises).then(results => {
        results.forEach(res => {
            console.log(`\nTable: ${res.table}`);
            console.table(res.columns);
        });
        db.end();
    });
  });
});
