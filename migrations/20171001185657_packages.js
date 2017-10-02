exports.up = function(knex, Promise) {
    return knex.schema.createTable('packages', table => {
        table.decimal('version').notNull();
        table.text('packageName').notNull();
        table.json('packageJson').notNull();
        /**
        * You have to keep track of the versiona nd the their dependency history
        * ex:

          version: 10.0.1
            dependency:
              foo: 2.3.4
              bar: 1.0.0

          version: 13.2.8
            dependency:
              foo: 3.0.2
              bar: 1.0.7

            {
              version: '<version-number>'
              dep: [
                  {
                      pkg: '<pkg-name>',
                      version: '<version-number>'
                  }
              ]
            }

            * create a fucntion to diff the old package dependency and the new
            published pkg dependency
        */
        table.json('packageDependencyHistory').notNull();
    });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('packages');
};
