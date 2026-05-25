const db = require('../config/db');

exports.getPack = (req, res) => {
    const { project_type, style, color_primary, color_secondary } = req.query;
    
    // We try to match as specifically as possible. 
    // Since colors could be one or two, we'll write a flexible query or just exact match.
    // The user's prompt suggests: WHERE project_type = 'Event Promotion' AND style = 'Traditional'; 
    // But they also have color filtering.
    
    let query = `SELECT * FROM packai WHERE project_type = ? AND style = ?`;
    let params = [project_type, style];

    if (color_primary) {
        query += ` AND color_primary = ?`;
        params.push(color_primary);
    }
    
    if (color_secondary) {
        query += ` AND color_secondary = ?`;
        params.push(color_secondary);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching packai:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
};
