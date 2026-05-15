const express = require('express');
const router = express.Router();
const artisteController = require('../controllers/artisteController');

router.get('/', artisteController.getAllArtistes);
router.get('/:id', artisteController.getArtisteById);
router.post('/', artisteController.createArtiste);
router.put('/:id', artisteController.updateArtiste);
router.delete('/:id', artisteController.deleteArtiste);

module.exports = router;
