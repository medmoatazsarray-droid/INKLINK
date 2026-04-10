const Challenge = require('../routes/models/challengeModel');

// Image upload removed as per database changes

exports.getAllChallenges = (req, res) => {
    Challenge.getAll((err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving challenges' });
        }
        res.status(200).json(results);
    });
};

exports.getChallengeById = (req, res) => {
    const { id } = req.params;
    Challenge.getById(id, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving challenge' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json(results[0]);
    });
};

exports.createChallenge = (req, res) => {
    const challengeData = {
        titre: req.body.titre,
        description: req.body.description,
        prix_gagnant: req.body.prix_gagnant,
        date_debut: req.body.date_debut,
        date_fin: req.body.date_fin,
        statut: req.body.statut,
        tag: req.body.tag
    };

    if (!challengeData.titre || !challengeData.date_debut || !challengeData.date_fin) {
        return res.status(400).json({ message: 'Titre, date_debut and date_fin are required' });
    }

    Challenge.create(challengeData, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error creating challenge', error: err.message, stack: err.stack });
        }
        res.status(201).json({ 
            message: 'Challenge created successfully', 
            id_challenge: result.insertId 
        });
    });
};

exports.updateChallenge = (req, res) => {
    const { id } = req.params;
    const challengeData = { ...req.body };

    Challenge.update(id, challengeData, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating challenge' });
        }
        res.status(200).json({ message: 'Challenge updated successfully' });
    });
};

exports.deleteChallenge = (req, res) => {
    const { id } = req.params;
    Challenge.delete(id, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error deleting challenge' });
        }
        res.status(200).json({ message: 'Challenge deleted successfully' });
    });
};
