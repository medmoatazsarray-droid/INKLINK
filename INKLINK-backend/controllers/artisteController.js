const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper to save base64 image to uploads/ folder
const saveBase64Image = (base64Str) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) return null;
    
    try {
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return null;
        
        const ext = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${Date.now()}_artiste.${ext}`;
        const relativePath = `/uploads/${filename}`;
        const absolutePath = path.join(__dirname, '../uploads', filename);
        
        // Ensure uploads directory exists
        const dir = path.dirname(absolutePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(absolutePath, buffer);
        return relativePath;
    } catch (err) {
        console.error('Error saving base64 image:', err);
        return null;
    }
};

exports.getAllArtistes = (req, res) => {
    db.query('SELECT * FROM artiste', (err, results) => {
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

    db.query('SELECT * FROM artiste WHERE id_artiste = ? LIMIT 1', [id], (err, results) => {
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

    const location = req.body?.location ? String(req.body.location).trim() : null;
    const bio = req.body?.bio ? String(req.body.bio).trim() : null;
    const email = req.body?.email ? String(req.body.email).trim() : null;
    const telephone = req.body?.telephone ? String(req.body.telephone).trim() : null;
    
    // Save image if sent as base64 string
    const image = req.body?.image ? saveBase64Image(req.body.image) : null;
    
    const skills = req.body?.skills ? String(req.body.skills).trim() : null;
    const type_artiste = req.body?.type_artiste ? String(req.body.type_artiste).trim() : null;
    
    let statut = 'ACTIF';
    if (req.body?.statut) {
        const s = String(req.body.statut).toUpperCase();
        if (s.startsWith('ACTIF') || s.startsWith('ACTIFE')) {
            statut = 'ACTIF';
        } else if (s.startsWith('INACTIF')) {
            statut = 'INACTIF';
        }
    }

    db.query(
        'INSERT INTO artiste (nom, location, bio, email, telephone, image, skills, type_artiste, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nom, location, bio, email, telephone, image, skills, type_artiste, statut],
        (err, result) => {
            if (err) {
                console.error('Database error creating artiste:', err);
                return res.status(500).json({ message: 'Error creating artiste' });
            }
            res.status(201).json({ message: 'Artiste created', id_artiste: result.insertId });
        }
    );
};

exports.updateArtiste = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid artiste id' });
    const nom = String(req.body?.nom || '').trim();
    if (!nom) return res.status(400).json({ message: 'nom is required' });

    const location = req.body?.location ? String(req.body.location).trim() : null;
    const bio = req.body?.bio ? String(req.body.bio).trim() : null;
    const email = req.body?.email ? String(req.body.email).trim() : null;
    const telephone = req.body?.telephone ? String(req.body.telephone).trim() : null;
    const image = req.body?.image ? (req.body.image.startsWith('data:image/') ? saveBase64Image(req.body.image) : String(req.body.image).trim()) : null;
    const skills = req.body?.skills ? String(req.body.skills).trim() : null;
    const type_artiste = req.body?.type_artiste ? String(req.body.type_artiste).trim() : null;

    let statut = 'ACTIF';
    if (req.body?.statut) {
        const s = String(req.body.statut).toUpperCase();
        if (s.startsWith('ACTIF') || s.startsWith('ACTIFE')) {
            statut = 'ACTIF';
        } else if (s.startsWith('INACTIF')) {
            statut = 'INACTIF';
        }
    }

    db.query(
        'UPDATE artiste SET nom = ?, location = ?, bio = ?, email = ?, telephone = ?, image = ?, skills = ?, type_artiste = ?, statut = ? WHERE id_artiste = ?',
        [nom, location, bio, email, telephone, image, skills, type_artiste, statut, id],
        (err, result) => {
            if (err) {
                console.error('Database error updating artiste:', err);
                return res.status(500).json({ message: 'Error updating artiste' });
            }
            if (!result || result.affectedRows === 0) return res.status(404).json({ message: 'Artiste not found' });
            res.status(200).json({ message: 'Artiste updated' });
        }
    );
};

exports.deleteArtiste = (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid artiste id' });

    db.query('DELETE FROM artiste WHERE id_artiste = ?', [id], (err, result) => {
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
