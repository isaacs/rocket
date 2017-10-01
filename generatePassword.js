const bCrypt = require('bCrypt');
const numberOfRounds = 3;
const password = 'Cryptographia1';
//const salt = bCrypt.genSaltSync(numberOfRounds);
const encryptedPassword = bCrypt.hashSync(
  password,
  '$2a$04$b.dbXA8S8XjGfqyn4XvuXO'
);

console.log(encryptedPassword);
