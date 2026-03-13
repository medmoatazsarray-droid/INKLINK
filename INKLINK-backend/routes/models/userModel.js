const db = require('../../config/db');

const User = {
    findById: (idUser, callback) => {
        const sql = 'SELECT * FROM utilisateur WHERE id_user = ?';
        db.query(sql, [idUser], callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM utilisateur WHERE email = ?';
        db.query(sql, [email], callback);
    },
    updateProfile: (idUser, data, callback) => {
        const fields = [];
        const values = [];
        if (data.nom) { fields.push('nom = ?'); values.push(data.nom); }
        if (data.prenom) { fields.push('prenom = ?'); values.push(data.prenom); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        if (data.telephone) { fields.push('telephone = ?'); values.push(data.telephone); }

        if (fields.length === 0) return callback(null, { affectedRows: 0 });

        const sql = `UPDATE utilisateur SET ${fields.join(', ')} WHERE id_user = ?`;
        values.push(idUser);
        db.query(sql, values, callback);
    },
    getOrders: (idUser, callback) => {
        const sql = `
            SELECT c.*, 
                   GROUP_CONCAT(p.nom SEPARATOR ', ') as produits
            FROM commande c
            LEFT JOIN lignecommande lc ON c.id_commande = lc.id_commande
            LEFT JOIN produit p ON lc.id_produit = p.id_produit
            WHERE c.id_user = ?
            GROUP BY c.id_commande
            ORDER BY c.dateCommande DESC
        `;
        db.query(sql, [idUser], callback);
    }
};

module.exports = User;
