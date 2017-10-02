const bCrypt = require('bCrypt');
const numberOfRounds = 3;
const password = 'password'; //OH MY FUCKING GOD.
const salt = bCrypt.genSaltSync(numberOfRounds);
const encryptedPassword = bCrypt.hashSync(password, salt);
console.log(salt);
console.log(encryptedPassword);
