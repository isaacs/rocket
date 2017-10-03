const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const targz = require('targz');
let publishBuffer;
const jsonParser = bodyParser.json({
  limit: '50mb',
  type: 'application/json',
});
if (!fs.existsSync('packages')) {
  try {
    fs.mkdirSync('packages');
  } catch (e) {
    console.log(e);
  }
}
let plainTextHashed;
//NOTE: The package lookup is being re-planned,
// Configs of modules
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
//Temporary BookShelf.JS models, still learning Bookshelf.

const bookshelf = require('bookshelf')(knex);
const Users = bookshelf.Model.extend({
  tableName: 'Users',
});
const Salt = bookshelf.Model.extend({
  tableName: 'Salts',
});

const packageInfo = bookshelf.Model.extend({
  tableName: 'packages',
});
// config section end
const id = 'org.couchdb.user:';

// NOTE: Package Info fetcher
// NOTE: And server of downloadable tarballs
app.get('/', (req, response) => {});

// NOTE: Publish download handler.
// will determine if the downloaded file is a proper
// package after it is extracted
// NOTE: Fix this. This is hardly a repository without it.
app.put('/:pkgName', jsonParser, (req, response) => {
  let data = req.body;
  if (data._attachments[Object.keys(data._attachments)].data) {
    publishBuffer = new Buffer(
      data._attachments[Object.keys(data._attachments)].data,
      'base64'
    );
    fs.writeFile(
      `packages/${Object.keys(data._attachments)[0]}`,
      publishBuffer,
      error => {
        if (error) {
          console.log(error);
        } else {
          console.log(
            `Downloaded ${Object.keys(
              data._attachments
            )[0]} to 'packages/${Object.keys(data._attachments)[0]}'`
          );
          // check if the downloaded file exists...
          fs.exists(
            `packages/${Object.keys(data._attachments)[0]}`,
            (error, exists) => {
              if (exists) {
                response.status(201);
                response.send({
                  ok: true,
                  message: 'Received loud and clear.',
                });
              } else {
                response.status(201); // look into the correct NPM error code to use.
                response.send({
                  ok: false,
                  message: 'unable to locate the downloaded package.tgz file',
                });
              }
            }
          );
        }
      }
    );
  }
});

let verificationSalt;
// NOTE: Authentication handler
// IDEA: Maybe Promisify each seperate database operation
// IDEA: then import them as a function in ./components/fetchSalts.js, for example?
app.put('/-/user/org.couchdb.user:username', jsonParser, (req, response) => {
  // look the user up in the database
  if (req.originalUrl.split(':')[1]) {
    // Fetch the current Hash.
    new Salt({ id: 1 })
      .fetch()
      .then(dbSalt => {
        if (dbSalt !== undefined) {
          // Now fetch the user data.
          // We only do this if the fetching of the hash works out,
          // then we will be able to verify the plain text password
          // against the hashed version, cause without the hash, we can't
          verificationSalt = dbSalt.toJSON().Salt;
          new Users({ name: req.body.name })
            .fetch()
            .then(users => {
              if (users !== undefined) {
                if (users.toJSON().name === req.body.name) {
                  console.log(req.body.name);
                  console.log(verificationSalt);
                  bcrypt
                    .hash(req.body.password, verificationSalt)
                    .then(comparisonHash => {
                      // now compare the plain text password to the hash.
                      bcrypt
                        .compare(req.body.password, comparisonHash)
                        .then(comparisonResult => {
                          if (comparisonResult) {
                            // yey correct password.
                            // NOTE: Thinking about sessions?
                            response.status(201);
                            response.send({ ok: true, message: 'logged in' });
                          } else {
                            // you shall not pass!
                            response.status(201);
                            response.send({
                              ok: false,
                              message:
                                'Incorrect username or password combination',
                            });
                          }
                        });
                    });
                } else {
                  console.log('User does not exist');
                  response.send({
                    message:
                      '[ROCKET] Username does not exist in your databases',
                  });
                }
              }
            })
            .catch(e => {
              // some other error occured.
              response.status(500); // change this, it's temporary.
              response.send({
                ok: false,
                message: 'An error occured during the login process: \n',
                e,
              });
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
