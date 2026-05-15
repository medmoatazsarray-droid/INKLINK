const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

db.query("DESCRIBE commande", (err, res) => {
    console.log('commande columns:', res);
    db.query("DESCRIBE lignecommande", (err, res2) => {
        console.log('lignecommande columns:', res2);
        process.exit();
    });
});
