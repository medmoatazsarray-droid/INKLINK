const db = require('../config/db');

exports.getAllCategories = (req, res) => {
    db.query('SELECT * FROM categorie', (err, results) => {
        if (err) {
            console.error('Database error fetching categories:', err);
            return res.status(500).json({ message: 'Error fetching categories' });
        }
        res.status(200).json(results);
    });
};
