const db = require('../config/db');

exports.getAvis = (req, res) => {
    const query = `
        SELECT 
            a.id_avis,
            a.commentaire AS comment,
            a.dateCreation,
            CONCAT(u.nom, ' ', u.prenom) AS name
        FROM avis a
        JOIN utilisateur u ON a.id_user = u.id_user
        WHERE a.statut = 'VISIBLE'
        ORDER BY a.id_avis DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error fetching avis:', err);
            if (err.code === 'ER_NO_SUCH_TABLE') {
                return res.status(200).json([]);
            }
            return res.status(500).json({ message: 'Error fetching reviews' });
        }
        res.status(200).json(results);
    });
};
