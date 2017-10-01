const bCrypt = require('bCrypt');
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('hashes', table => {
      table.increments('id');
      table.string('Hash').notNull();
      table.dateTime('createdAt').notNull();
    }),
  ]).then(() => {
    return knex('hashes').insert([{ Hash: bCrypt.genSaltSync(3) }]); // salt you moron.
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('hashes');
};
