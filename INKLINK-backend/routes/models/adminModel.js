const db =require('../../config/db');
const Admin= {
    findByUsername: (username,callback) => {
        const sql = 'SELECT * FROM Admin WHERE username = ?';
        db.query(sql,[username],callback);

    },
    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM Admin WHERE email = ?';
        db.query(sql, [email], callback);
    },
    updatePasswordById: (idAdmin, hashedPassword, callback) => {
        const sql = 'UPDATE Admin SET password = ? WHERE id_admin = ?';
        db.query(sql, [hashedPassword, idAdmin], callback);
    }
};
module.exports = Admin;
