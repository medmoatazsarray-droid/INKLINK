const db = require('../../config/db');

const Challenge = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM challenge ORDER BY date_debut DESC';
        db.query(sql, callback);
    },
    getById: (id, callback) => {
        const sql = 'SELECT * FROM challenge WHERE id_challenge = ?';
        db.query(sql, [id], callback);
    },
    create: (data, callback) => {
        const sql = `
            INSERT INTO challenge (titre, description, prix_gagnant, date_debut, date_fin, statut, tag)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.titre,
            data.description,
            data.prix_gagnant !== undefined ? data.prix_gagnant : null,
            data.date_debut,
            data.date_fin,
            data.statut || 'actif',
            data.tag || 'featured'
        ];
        db.query(sql, values, callback);
    },
    update: (id, data, callback) => {
        const fields = [];
        const values = [];
        const allowedFields = ['titre', 'description', 'prix_gagnant', 'date_debut', 'date_fin', 'statut', 'tag'];
        
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return callback(null, { affectedRows: 0 });

        const sql = `UPDATE challenge SET ${fields.join(', ')} WHERE id_challenge = ?`;
        values.push(id);
        db.query(sql, values, callback);
    },
    delete: (id, callback) => {
        const sql = 'DELETE FROM challenge WHERE id_challenge = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Challenge;
