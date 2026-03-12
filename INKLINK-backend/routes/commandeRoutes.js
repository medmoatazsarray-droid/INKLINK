const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
router.get('/commandes', (req, res) => {
  const sql = `
    SELECT c.*, u.nom as client_nom, u.prenom as client_prenom
    FROM Commande c
    LEFT JOIN Utilisateur u ON c.id_user = u.id_user
    ORDER BY c.dateCommande DESC
  `;
  db.query(sql , (err,results) => {
    if(err) {
        console.log(err);
        return res.status(500).json({error:err});
    }
    res.json(results);
  });
});

router.put('/commande/:id/statut' , (req,res)=> {
    const {statut} = req.body;
    const sql = "UPDATE commande SET statut = ? WHERE id_commande = ?";
    db.query(sql, [statut,req.params.id],(err) => {
        if(err){
            console.log(err);
            return res.status(500).json({error : err});
        }
        res.json({message : 'statut mise à jour'});
    });
});
router.delete('/commande/:id',(req,res)=> {
    const sql ="DELETE FROM commande WHERE id_commande = ? ";
    db.query(sql, [req.params.id] , (err) => {
        if(err){
            console.log(err);
            return res.status(500).json({error:err});
        }
        res.json({message:'commande supprimée'})
    });
});
module.exports = router;