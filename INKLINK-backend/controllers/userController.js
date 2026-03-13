const User = require('../routes/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Helper to extract user ID from JWT token
const getUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.slice(7).trim();
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            return payload.id || null;
        } catch {
            return null;
        }
    }
    return null;
};

// GET /api/user/profile/:id
exports.getProfile = (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    User.findById(userId, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = results[0];
        res.status(200).json({
            id_user: user.id_user,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            telephone: user.telephone,
            statut: user.statut,
            dateInscription: user.dateInscription
        });
    });
};

// PUT /api/user/profile/:id
exports.updateProfile = (req, res) => {
    const userId = req.params.id;
    const { nom, prenom, email, telephone } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const updateData = {};
    if (nom) updateData.nom = nom;
    if (prenom) updateData.prenom = prenom;
    if (email) updateData.email = email;
    if (telephone) updateData.telephone = telephone;

    User.updateProfile(userId, updateData, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            return res.status(500).json({ message: 'Error updating profile' });
        }

        // Fetch updated user
        User.findById(userId, (findErr, rows) => {
            if (findErr) {
                console.error('Database error:', findErr);
                return res.status(500).json({ message: 'Database error' });
            }
            const user = rows && rows[0];
            res.status(200).json({
                message: 'Profile updated successfully',
                user: user ? {
                    id_user: user.id_user,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    telephone: user.telephone,
                    statut: user.statut,
                    dateInscription: user.dateInscription
                } : null
            });
        });
    });
};

// GET /api/user/orders/:id
exports.getOrders = (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    User.getOrders(userId, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results || []);
    });
};

// POST /api/user/register
exports.register = (req, res) => {
    const { nom, prenom, email, mot_de_passe, telephone } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe) {
        return res.status(400).json({ message: 'nom, prenom, email and mot_de_passe are required' });
    }

    // Check if email already exists
    User.findByEmail(email, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results && results.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        bcrypt.hash(mot_de_passe, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Bcrypt hash error:', hashErr);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            const db = require('../config/db');
            const sql = 'INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, telephone) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [nom, prenom, email, hashedPassword, telephone || null], (insertErr, result) => {
                if (insertErr) {
                    console.error('Insert error:', insertErr);
                    return res.status(500).json({ message: 'Error creating user' });
                }

                const token = jwt.sign(
                    { id: result.insertId, email, role: 'client' },
                    process.env.JWT_SECRET || 'your_secret_key',
                    { expiresIn: '24h' }
                );

                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: {
                        id_user: result.insertId,
                        nom,
                        prenom,
                        email,
                        telephone: telephone || null
                    }
                });
            });
        });
    });
};

// POST /api/user/login
exports.login = (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    User.findByEmail(email, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!results || results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        bcrypt.compare(mot_de_passe, user.mot_de_passe, (compareErr, isMatch) => {
            if (compareErr) {
                console.error('Bcrypt error:', compareErr);
                return res.status(500).json({ message: 'Password comparison error' });
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id_user, email: user.email, role: 'client' },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '24h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    id_user: user.id_user,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    telephone: user.telephone,
                    statut: user.statut
                }
            });
        });
    });
};
