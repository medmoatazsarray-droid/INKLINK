const db = require('../config/db');

async function inspectData() {
    db.query("SELECT * FROM commande WHERE statut = 'EN_ATTENTE'", (err, results) => {
        if (err) {
            console.error('Error:', err);
            process.exit(1);
        }
        console.log('Active Orders (Carts):', results);
        if (results && results.length > 0) {
            const ids = results.map(r => r.id_commande);
            db.query("SELECT * FROM ligne_commande WHERE id_commande IN (?)", [ids], (err, items) => {
                if (err) console.error(err);
                console.log('Cart Items:', items);
                process.exit();
            });
        } else {
            console.log('No active carts found.');
            process.exit();
        }
    });
}

inspectData();
