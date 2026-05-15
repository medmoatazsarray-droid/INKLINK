const express = require('express');
const router = express.Router();
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const logError = (msg, err) => {
    const logMsg = `[${new Date().toISOString()}] ${msg}: ${err.message || JSON.stringify(err)}\n`;
    fs.appendFileSync(path.join(__dirname, '../backend_errors.log'), logMsg);
};

// Get active cart for a user
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT pp.id_panierP as id_ligne, pp.quantite, p.nom, p.prixBase, p.image, p.id_produit
        FROM panierproduit pp
        JOIN produit p ON pp.id_produit = p.id_produit
        JOIN panier pa ON pp.id_panier = pa.id_panier
        WHERE pa.id_user = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            logError('Error fetching cart', err);
            return res.status(500).json({ error: err.message || err });
        }
        res.json(results);
    });
});


// Add item to cart
router.post('/add', (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log('Incoming add to cart request:', req.body);
    
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Missing required fields: userId, productId, or quantity' });
    }

    // 1. Find or create panier for user
    const findPanierSql = "SELECT id_panier FROM panier WHERE id_user = ? LIMIT 1";
    db.query(findPanierSql, [userId], (err, results) => {
        if (err) {
            logError('Error finding panier', err);
            return res.status(500).json({ error: err.message || err });
        }
        
        const addItemToPanier = (panierId) => {
            console.log('Adding item to panier ID:', panierId);
            // Check if product already in panier to update quantity or add new
            const checkItemSql = "SELECT id_panierP, quantite FROM panierproduit WHERE id_panier = ? AND id_produit = ?";
            db.query(checkItemSql, [panierId, productId], (err, items) => {
                if (err) {
                    logError('Error checking existing item', err);
                    return res.status(500).json({ error: err.message || err });
                }

                if (items.length > 0) {
                    const newQty = items[0].quantite + quantity;
                    const updateSql = "UPDATE panierproduit SET quantite = ? WHERE id_panierP = ?";
                    db.query(updateSql, [newQty, items[0].id_panierP], (err) => {
                        if (err) {
                            logError('Error updating quantity', err);
                            return res.status(500).json({ error: err.message || err });
                        }
                        res.json({ message: 'Cart updated', id_panier: panierId });
                    });
                } else {
                    const addLineSql = "INSERT INTO panierproduit (id_panier, id_produit, quantite) VALUES (?, ?, ?)";
                    db.query(addLineSql, [panierId, productId, quantity], (err) => {
                        if (err) {
                            logError('Error adding to panierproduit', err);
                            return res.status(500).json({ error: err.message || err });
                        }
                        res.json({ message: 'Product added to panier', id_panier: panierId });
                    });
                }
            });
        };

        if (results.length > 0) {
            addItemToPanier(results[0].id_panier);
        } else {
            console.log('No panier found for user, creating one...');
            const createPanierSql = "INSERT INTO panier (id_user) VALUES (?)";
            db.query(createPanierSql, [userId], (err, result) => {
                if (err) {
                    logError('Error creating panier', err);
                    return res.status(500).json({ error: err.message || err });
                }
                addItemToPanier(result.insertId);
            });
        }
    });
});



// Remove item from cart
router.delete('/item/:id', (req, res) => {
    const sql = "DELETE FROM panierproduit WHERE id_panierP = ?";
    db.query(sql, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Item removed from panier' });
    });
});

module.exports = router;

