const bcrypt = require('bcrypt');
const plainPassword = "1234567890GO";
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log('hashed password : ', hash);
});