const express = require('express'),
      app = express();

const bodyParser = require('body-parser');

const fs = require('fs');

const mysql = require('mysql');
const kenxConfig = require('./knexfile.js');

const knex = require('knex')(kenxConfig.development);
const bookshelf = require('bookshelf')(knex);

const crypto = require('crypto');
const bcrypt = require('bcrypt');

// global variables
const id = 'org.couchdb.user:';
const PORT = process.env.PORT || 3000;

// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Use body-parser as middleware for the app.
app.use(bodyParser.json());

const Users = bookshelf.Model.extend({
    tableName: 'Users',
});
const Hash = bookshelf.Model.extend({
    tableName: 'hashes',
});

app.get('/', function(req, res) {
    res.send('Hello World!');
});

// fetchs the database hash
async function fetchdbHash() {
    const dbhash = await new Hash({ id: 1 }).fetch();
    if (dbhash !== undefined) {
        /*
            Now fetch the user data.
            We only do this if the fetching of the hash works out,
            then we will be able to verify the plain text password
            against the hashed version, cause without the hash, we can't
        */
        return await dbHash.toJSON().Hash;
    }
}

// fetchs user from database
async fetchUser(name, password, verificationHash) {
    const Users = await new Users({ name });
    if (Users !== undefined) {
        // response.status(201);
        // response.send({ ok: true });
        // console.log(verificationHash);

        return await bcrypt.compare(
            password,
            bcrypt.hashSync(password, verificationHash);
        )
    }
}

// NOTE: Late night code - not yet been reviewed. Login works.
// TODO: Re-Work the storage of hashes and so on and wtf was I doing. got confused, apparently
app.put('/-/user/org.couchdb.user:username', (req, response) => {
      const name = req.body.name;
      const password = req.body.password;
      let verificationHash;

      // look the user up in the database
      if (req.originalUrl.split(':')[1]) {

          getdbHash()
          .then(dbhash => {

              fetchUser(name, password, dbHash)
              .then(resp => {
                  // in the next few versions we will create a session here
                  if (resp) {
                      response.status(201);
                      response.send({ ok: true });
                      return
                  }
                  response.send({ ok: false, message: 'wrong password' });
              })
              .catch(err => {
                  console.log('User does not exist');
                  response.send({ ok: false, message: 'Scope not found' });
              });
          })
          .catch(err => {
              console.log('An error ocured while fetching the Hash.');
              console.log(err);
          });
      }
});

app.listen(PORT, function() {
    console.log('Rocket is listening on port 3000');
});
