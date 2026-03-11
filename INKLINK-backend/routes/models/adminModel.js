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
    }
};
module.exports = Admin;
