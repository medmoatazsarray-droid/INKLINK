const Participation = require('../routes/models/participationModel');

exports.participate = (req, res) => {
    const { id_challenge, id_user } = req.body;

    if (!id_challenge || !id_user) {
        return res.status(400).json({ message: 'id_challenge and id_user are required' });
    }

    // Check if user already participated
    Participation.checkParticipation(id_challenge, id_user, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error checking participation' });
        }
        if (results && results.length > 0) {
            return res.status(400).json({ message: 'User already participated in this challenge' });
        }

        Participation.create({ id_challenge, id_user }, (createErr, result) => {
            if (createErr) {
                console.error('Database error:', createErr);
                return res.status(500).json({ message: 'Error creating participation' });
            }
            res.status(201).json({ message: 'Participation recorded successfully', id_part: result.insertId });
        });
    });
};

exports.getParticipationsByChallenge = (req, res) => {
    const { id } = req.params; // id_challenge
    Participation.getByChallenge(id, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving participations' });
        }
        res.status(200).json(results);
    });
};

exports.getParticipationsByUser = (req, res) => {
    const { id } = req.params; // id_user
    Participation.getByUser(id, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error retrieving participations' });
        }
        res.status(200).json(results);
    });
};

exports.updateParticipationStatut = (req, res) => {
    const { id } = req.params; // id_part
    const { statut } = req.body;

    if (!statut) {
        return res.status(400).json({ message: 'Statut is required' });
    }

    Participation.updateStatut(id, statut, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error updating participation statut' });
        }
        res.status(200).json({ message: 'Participation statut updated successfully' });
    });
};
