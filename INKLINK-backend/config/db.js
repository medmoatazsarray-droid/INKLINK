const mysql = require('mysql2');
const db=mysql.createConnection({
    host : 'mysql-medmoatazsarray789.alwaysdata.net',
    user : 'medmoatazsarray789',
    password : '123SD789',
    database : 'medmoatazsarray789_inklink'
});
db.connect((err)=>{
    if(err)
    {
        console.error('base de données non connectée : ',err.stack);
        return;
    }
    console.log('base de données connectée avec succès');
});
module.exports = db;