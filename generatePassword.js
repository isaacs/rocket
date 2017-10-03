const bCrypt = require('bCrypt');
const password = process.env.bCrypt_key;

const encryptedPassword = bCrypt.hashSync(
  password,
  '$2a$04$b.dbXA8S8XjGfqyn4XvuXO'
);

console.log(encryptedPassword);
