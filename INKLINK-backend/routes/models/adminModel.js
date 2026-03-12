const db = require('../../config/db');
const Admin = {
    findByUsername: (username, callback) => {
        const sql = 'SELECT * FROM admin WHERE username = ?';
        db.query(sql, [username], callback);

    },
    findByIdentifier: (identifier, callback) => {
        const sql = 'SELECT * FROM admin WHERE username = ? OR email = ?';
        db.query(sql, [identifier, identifier], callback);
    },
    findById: (idAdmin, callback) => {
        const sql = 'SELECT * FROM admin WHERE id_admin = ?';
        db.query(sql, [idAdmin], callback);
    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM admin WHERE email = ?';
        db.query(sql, [email], callback);
    },
    updatePasswordById: (idAdmin, hashedPassword, callback) => {
        const sql = 'UPDATE admin SET password = ? WHERE id_admin = ?';
        db.query(sql, [hashedPassword, idAdmin], callback);
    },
    updateProfile: (idAdmin, data, callback) => {
        const fields = [];
        const values = [];
        if (data.username) { fields.push('username = ?'); values.push(data.username); }
        if (data.email) { fields.push('email = ?'); values.push(data.email); }
        if (data.password) { fields.push('password = ?'); values.push(data.password); }
        if (data.profile_image) { fields.push('profile_image = ?'); values.push(data.profile_image); }
        
        if (fields.length === 0) return callback(null, { affectedRows: 0 });
        
        const sql = `UPDATE admin SET ${fields.join(', ')} WHERE id_admin = ?`;
        values.push(idAdmin);
        db.query(sql, values, callback);
    }
};
module.exports = Admin;
