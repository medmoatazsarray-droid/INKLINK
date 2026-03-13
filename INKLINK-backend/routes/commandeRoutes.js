const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/commande', (req, res) => {
    const sql = `
    SELECT c.*, u.nom as client_nom, u.prenom as client_prenom
    FROM commande c
    LEFT JOIN utilisateur u ON c.id_user = u.id_user
    ORDER BY c.dateCommande DESC
  `;
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

router.get('/commande/search', (req, res) => {
    const q = req.query.q || '';
    const sql = `
    SELECT c.*, u.nom as client_nom, u.prenom as client_prenom
    FROM commande c
    LEFT JOIN utilisateur u ON c.id_user = u.id_user
    WHERE c.id_commande LIKE ? OR u.nom LIKE ? OR u.prenom LIKE ?
    ORDER BY c.dateCommande DESC
  `;
    const searchTerm = `%${q}%`;
    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

router.get('/commande/:id', (req, res) => {
    const sql = `
    SELECT c.*, u.nom as client_nom, u.prenom as client_prenom, u.telephone as client_telephone
    FROM commande c
    LEFT JOIN utilisateur u ON c.id_user = u.id_user
    WHERE c.id_commande = ?
  `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(results[0]);
    });
});

router.put('/commande/:id/statut', (req, res) => {
    const { statut } = req.body;
    const sql = "UPDATE commande SET statut = ? WHERE id_commande = ?";
    db.query(sql, [statut, req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'statut mise à jour' });
    });
});
router.delete('/commande/:id', (req, res) => {
    const sql = "DELETE FROM commande WHERE id_commande = ? ";
    db.query(sql, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }
        res.json({ message: 'commande supprimée' })
    });
});
module.exports = router;