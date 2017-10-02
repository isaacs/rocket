exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id');
    table.timestamps();
    table.string('name');
    table.string('email', 128);
    table.string('password');
    table.string('role').defaultTo('user');
  });
};

exports.down = function(knex, Promise) {
  return knex.scema.dropTable('users');
};
