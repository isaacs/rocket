exports.up = function(knex, Promise) {
  return knex.schema.createTable('packages', table => {
    table.decimal('version').notNull();
    table.text('Name').notNull();
    table.text('packageJson').notNull();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('packages');
};
