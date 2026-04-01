const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.get('/', produitController.getAllProduits);
router.get('/search', produitController.searchProduits);
router.get('/category/:id', produitController.getProduitsByCategory);
router.get('/:id', produitController.getProduitById);
router.post('/', produitController.uploadImage, produitController.createProduit);
router.put('/:id', produitController.uploadImage, produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);

module.exports = router;
