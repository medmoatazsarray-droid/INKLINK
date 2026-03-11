const db = require('../config/db');

exports.getAllArtistes = (req, res) => {
    db.query('SELECT * FROM artiste', (err, results) => {
        if (err) {
            console.error('Database error fetching artistes:', err);
            return res.status(500).json({ message: 'Error fetching artistes' });
        }
        res.status(200).json(results);
    });
};
