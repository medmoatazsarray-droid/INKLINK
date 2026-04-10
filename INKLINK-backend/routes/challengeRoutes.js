const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const participationController = require('../controllers/participationController');

router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallengeById);
router.post('/', challengeController.createChallenge);
router.put('/:id', challengeController.updateChallenge);
router.delete('/:id', challengeController.deleteChallenge);

router.post('/participate', participationController.participate);
router.get('/:id/participations', participationController.getParticipationsByChallenge);
router.get('/user/:id/participations', participationController.getParticipationsByUser);
router.put('/participation/:id/statut', participationController.updateParticipationStatut);

module.exports = router;
