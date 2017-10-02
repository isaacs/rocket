const bCrypt = require('bCrypt');
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('Salts', table => {
      table.increments('id');
      table.string('Salt').notNull();
      table.dateTime('createdAt').notNull();
    }),
  ]).then(() => {
    return knex('Salts').insert([{ Salt: bCrypt.genSaltSync(3) }]); // salt you moron.
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Salts');
};
