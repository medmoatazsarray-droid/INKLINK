const express = require('express');
const router = express.Router();
const db = require('../config/db');
router.get('/stats', (req,res) => {
    const sql = `
    SELECT 
    (SELECT COUNT(*) FROM produit) AS totalProduits,
    (SELECT COUNT(*) FROM artiste) AS totalArtistes,
    (SELECT COUNT(*) FROM commande) AS totalCommandes,
    (SELECT IFNULL(SUM(total), 0) FROM commande WHERE statut != 'ANNULEE') AS totalRevenus;
    `;
    db.query(sql, (err, result) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(result[0]);
    });
});
module.exports = router;