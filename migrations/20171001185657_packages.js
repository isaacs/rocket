exports.up = function(knex, Promise) {
  return knex.schema.createTable('packages', table => {
    table
      .increments('id')
      .unsigned()
      .primary();
    table.dateTime('createdAt').notNull();
    table.dateTime('updatedAt').nullable();
    table.string('Name').notNull();
    table.text('Description').notNull();
    table.decimal('version').notNull();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('packages');
};
