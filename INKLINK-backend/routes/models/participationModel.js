const db = require('../../config/db');

const Participation = {
    create: (data, callback) => {
        const sql = `
            INSERT INTO participation (id_challenge, id_user, date_soumission, statut)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            data.id_challenge,
            data.id_user,
            new Date(),
            data.statut || 'en_attente'
        ];
        db.query(sql, values, callback);
    },
    getByChallenge: (idChallenge, callback) => {
        const sql = `
            SELECT p.*, u.nom, u.prenom, u.email 
            FROM participation p
            JOIN utilisateur u ON p.id_user = u.id_user
            WHERE p.id_challenge = ?
            ORDER BY p.date_soumission DESC
        `;
        db.query(sql, [idChallenge], callback);
    },
    getByUser: (idUser, callback) => {
        const sql = `
            SELECT p.*, c.titre, c.image as challenge_image
            FROM participation p
            JOIN challenge c ON p.id_challenge = c.id_challenge
            WHERE p.id_user = ?
            ORDER BY p.date_soumission DESC
        `;
        db.query(sql, [idUser], callback);
    },
    updateStatut: (idPart, statut, callback) => {
        const sql = 'UPDATE participation SET statut = ? WHERE id_part = ?';
        db.query(sql, [statut, idPart], callback);
    },
    checkParticipation: (idChallenge, idUser, callback) => {
        const sql = 'SELECT * FROM participation WHERE id_challenge = ? AND id_user = ?';
        db.query(sql, [idChallenge, idUser], callback);
    }
};

module.exports = Participation;
