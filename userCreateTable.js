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
knex.schema.createTable('users', function(table) {
  table.increments();
  table.string('name');
  table.string('email', 128);
  table.string('role').defaultTo('user');
  table.string('password');
  table.timestamps();
});
