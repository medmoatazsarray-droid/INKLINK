const db = require('../config/db');

exports.getAllArtistes = (req, res) => {
    db.query('SELECT * FROM artistes', (err, results) => {
        if (err) {
            console.error('Database error fetching artistes:', err);
            return res.status(500).json({ message: 'Error fetching artistes' });
        }
        res.status(200).json(results || []);
    });
};

exports.getArtisteById = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid artiste id' });

    db.query('SELECT * FROM artistes WHERE id_artiste = ? LIMIT 1', [id], (err, results) => {
        if (err) {
            console.error('Database error fetching artiste:', err);
            return res.status(500).json({ message: 'Error fetching artiste' });
        }
        if (!results || results.length === 0) return res.status(404).json({ message: 'Artiste not found' });
        res.status(200).json(results[0]);
    });
};

exports.createArtiste = (req, res) => {
    const nom = String(req.body?.nom || '').trim();
    if (!nom) return res.status(400).json({ message: 'nom is required' });

    db.query('INSERT INTO artistes (nom) VALUES (?)', [nom], (err, result) => {
        if (err) {
            console.error('Database error creating artiste:', err);
            return res.status(500).json({ message: 'Error creating artiste' });
        }
        res.status(201).json({ message: 'Artiste created', id_artiste: result.insertId });
    });
};

exports.updateArtiste = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid artiste id' });
    const nom = String(req.body?.nom || '').trim();
    if (!nom) return res.status(400).json({ message: 'nom is required' });

    db.query('UPDATE artistes SET nom = ? WHERE id_artiste = ?', [nom, id], (err, result) => {
        if (err) {
            console.error('Database error updating artiste:', err);
            return res.status(500).json({ message: 'Error updating artiste' });
        }
        if (!result || result.affectedRows === 0) return res.status(404).json({ message: 'Artiste not found' });
        res.status(200).json({ message: 'Artiste updated' });
    });
};

exports.deleteArtiste = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid artiste id' });

    db.query('DELETE FROM artistes WHERE id_artiste = ?', [id], (err, result) => {
        if (err) {
            const code = err.code || '';
            if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_ROW_IS_REFERENCED') {
                return res.status(409).json({ message: 'Artiste is referenced and cannot be deleted' });
            }
            console.error('Database error deleting artiste:', err);
            return res.status(500).json({ message: 'Error deleting artiste' });
        }
        if (!result || result.affectedRows === 0) return res.status(404).json({ message: 'Artiste not found' });
        res.status(200).json({ message: 'Artiste deleted' });
    });
};
