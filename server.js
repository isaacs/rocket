const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Use body-parser as middleware for the app.
app.use(bodyParser.json());
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Rocket',
    port: 8889,
  },
});
const bookshelf = require('bookshelf')(knex);
const Users = bookshelf.Model.extend({
  tableName: 'Users',
});
const Hash = bookshelf.Model.extend({
  tableName: 'hashes',
});
const id = 'org.couchdb.user:';
app.get('/', function(req, res) {
  res.send('Hello World!');
});

let verificationHash;
// NOTE: Late night code - not yet been reviewed. Login works.
// TODO: Re-Work the storage of hashes and so on and wtf was I doing. got confused, apparently
app.put('/-/user/org.couchdb.user:username', (req, response) => {
  // look the user up in the database
  if (req.originalUrl.split(':')[1]) {
    // ^ find a better way to do this
    // Fetch the current Hash.
    new Hash({ id: 1 })
      .fetch()
      .then(dbHash => {
        if (dbHash !== undefined) {
          // Now fetch the user data.
          // We only do this if the fetching of the hash works out,
          // then we will be able to verify the plain text password
          // against the hashed version, cause without the hash, we can't
          verificationHash = dbHash.toJSON().Hash;
          new Users({ name: req.body.name })
            .fetch()
            .then(users => {
              if (users !== undefined) {
                // response.status(201);
                // response.send({ ok: true });
                //  console.log(verificationHash);
                console.log(req.body.name);
                console.log(verificationHash);
                bcrypt
                  .compare(
                    req.body.password,
                    bcrypt.hashSync(req.body.password, verificationHash)
                  )
                  .then(result => {
                    console.log(result);
                    if (result) {
                      response.status(201);
                      response.send({ ok: true });
                      // in the next few versions we will create a session here
                    } else {
                      response.send({ ok: false, message: 'wrong password' });
                    }
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            })
            .catch(e => {
              console.log('User does not exist');
              response.send({ ok: false, message: 'Scope not found' });
            });
        }
      })
      .catch(e => {
        console.log('An error ocured while fetching the Hash.');
        console.log(e);
      });
  }
});

app.listen(3000, function() {
  console.log('Rocket is listening on port 3000');
});
