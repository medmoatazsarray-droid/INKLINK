const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('image');

const normalizeStatutProduction = (value) => {
    const v = String(value || '').trim().toUpperCase();
    if (v === 'IN_PROGRESS' || v === 'EN_COURS') return 'EN_COURS';
    if (v === 'DONE' || v === 'FINISHED' || v === 'TERMINE') return 'TERMINE';
    if (v === 'CANCELED' || v === 'CANCELLED' || v === 'ANNULE') return 'ANNULE';
    return 'EN_COURS';
};

exports.createProduit = (req, res) => {
    const { nom, description, prixBase, stock, id_categorie, id_artiste, statutProduction, template } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nom || String(nom).trim() === '') {
        return res.status(400).json({ message: 'nom is required' });
    }
    if (prixBase === undefined || prixBase === null || String(prixBase).trim() === '') {
        return res.status(400).json({ message: 'prixBase is required' });
    }
    if (stock === undefined || stock === null || String(stock).trim() === '') {
        return res.status(400).json({ message: 'stock is required' });
    }

    const prixBaseNumber = Number(prixBase);
    const stockNumber = Number(stock);
    if (!Number.isFinite(prixBaseNumber) || prixBaseNumber < 0) {
        return res.status(400).json({ message: 'prixBase must be a valid number' });
    }
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
        return res.status(400).json({ message: 'stock must be a valid integer' });
    }

    const query = `
        INSERT INTO produit (nom, description, prixBase, stock, id_categorie, id_artiste, statutProduction, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        String(nom).trim(),
        description,
        prixBaseNumber,
        stockNumber,
        id_categorie || null,
        id_artiste || null,
        normalizeStatutProduction(statutProduction),
        imagePath
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error creating product:', err);
            return res.status(500).json({ message: 'Error creating product' });
        }
        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    });
};

exports.searchProduits = (req, res) => {
    const q = String(req.query.q || '').trim();
    const categorieRaw = String(req.query.categorie || '').trim();
    const categorieId = categorieRaw === '' ? null : Number(categorieRaw);

    if (categorieRaw !== '' && !Number.isInteger(categorieId)) {
        return res.status(400).json({ message: 'categorie must be an integer' });
    }

    let whereSql = 'WHERE 1=1';
    const params = [];

    if (q) {
        whereSql += ' AND p.nom LIKE ?';
        params.push(`%${q}%`);
    }

    if (categorieId !== null) {
        whereSql += ' AND p.id_categorie = ?';
        params.push(categorieId);
    }

    const query = `
        SELECT
            p.id_produit,
            p.nom,
            p.description,
            p.prixBase,
            p.stock,
            p.statutProduction,
            p.id_categorie,
            p.id_artiste,
            p.image,
            c.nom AS categorie_nom,
            a.nom AS artiste_nom
        FROM produit p
        LEFT JOIN categorie c ON c.id_categorie = p.id_categorie
        LEFT JOIN artiste a ON a.id_artiste = p.id_artiste
        ${whereSql}
        ORDER BY p.id_produit DESC
    `;

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error searching products:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        return res.status(200).json(results);
    });
};

exports.getProduitById = (req, res) => {
    const idProduit = Number(req.params.id);
    if (!Number.isInteger(idProduit)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const query = `
        SELECT
            p.id_produit,
            p.nom,
            p.description,
            p.prixBase,
            p.stock,
            p.statutProduction,
            p.id_categorie,
            p.id_artiste,
            p.image,
            c.nom AS categorie_nom,
            a.nom AS artiste_nom
        FROM produit p
        LEFT JOIN categorie c ON c.id_categorie = p.id_categorie
        LEFT JOIN artiste a ON a.id_artiste = p.id_artiste
        WHERE p.id_produit = ?
        LIMIT 1
    `;

    db.query(query, [idProduit], (err, results) => {
        if (err) {
            console.error('Database error fetching product:', err);
            return res.status(500).json({ message: 'Error fetching product' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(results[0]);
    });
};

exports.updateProduit = (req, res) => {
    const idProduit = Number(req.params.id);
    if (!Number.isInteger(idProduit)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    const nom = req.body?.nom;
    const description = req.body?.description ?? null;
    const prixBase = req.body?.prixBase;
    const stock = req.body?.stock;
    const statutProduction = req.body?.statutProduction;
    const id_categorie = req.body?.id_categorie ?? null;
    const id_artiste = req.body?.id_artiste ?? null;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nom || String(nom).trim() === '') {
        return res.status(400).json({ message: 'nom is required' });
    }
    if (prixBase === undefined || prixBase === null || String(prixBase).trim() === '') {
        return res.status(400).json({ message: 'prixBase is required' });
    }
    if (stock === undefined || stock === null || String(stock).trim() === '') {
        return res.status(400).json({ message: 'stock is required' });
    }

    const prixBaseNumber = Number(prixBase);
    if (!Number.isFinite(prixBaseNumber) || prixBaseNumber < 0) {
        return res.status(400).json({ message: 'prixBase must be a valid number' });
    }

    const stockNumber = Number(stock);
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
        return res.status(400).json({ message: 'stock must be a valid integer' });
    }

    const categorieId = id_categorie === '' || id_categorie === undefined ? null : Number(id_categorie);
    if (categorieId !== null && !Number.isInteger(categorieId)) {
        return res.status(400).json({ message: 'id_categorie must be an integer' });
    }

    const artisteId = id_artiste === '' || id_artiste === undefined ? null : Number(id_artiste);
    if (artisteId !== null && !Number.isInteger(artisteId)) {
        return res.status(400).json({ message: 'id_artiste must be an integer' });
    }

    const fields = [
        'nom = ?',
        'description = ?',
        'prixBase = ?',
        'stock = ?',
        'id_categorie = ?',
        'id_artiste = ?',
        'statutProduction = ?'
    ];
    const values = [
        String(nom).trim(),
        description,
        prixBaseNumber,
        stockNumber,
        categorieId,
        artisteId,
        normalizeStatutProduction(statutProduction)
    ];

    if (imagePath) {
        fields.push('image = ?');
        values.push(imagePath);
    }

    values.push(idProduit);
    const query = `UPDATE produit SET ${fields.join(', ')} WHERE id_produit = ?`;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error updating product:', err);
            return res.status(500).json({ message: 'Error updating product' });
        }
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product updated successfully' });
    });
};

exports.deleteProduit = (req, res) => {
    const idProduit = Number(req.params.id);
    if (!Number.isInteger(idProduit)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    db.query('DELETE FROM produit WHERE id_produit = ?', [idProduit], (err, result) => {
        if (err) {
            const code = err.code || '';
            if (code === 'ER_ROW_IS_REFERENCED_2' || code === 'ER_ROW_IS_REFERENCED') {
                return res.status(409).json({ message: 'Product is referenced and cannot be deleted' });
            }
            console.error('Database error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product' });
        }
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully' });
    });
};
