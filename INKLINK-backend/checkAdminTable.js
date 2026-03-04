const db = require('./config/db');

console.log('Testing Admin table structure...');

db.query('DESCRIBE Admin', (err, results) => {
    if (err) {
        console.error('Error describing table:', err);
        process.exit(1);
    }
    console.log('\n=== Admin Table Columns ===');
    results.forEach(col => {
        console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULLABLE'}`);
    });
    
    console.log('\n=== Admin Table Data ===');
    db.query('SELECT * FROM Admin', (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err);
            process.exit(1);
        }
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    });
});
