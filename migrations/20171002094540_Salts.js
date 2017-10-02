const bCrypt = require('bCrypt');

exports.up = function(knex, Promise) {
    async function createTableAndInsertSalt() {
        const table = await knex.schema.createTable('Salts', table => {
            table.uuid('id');
            table.string('Salt').notNull();
            table.dateTime('createdAt').notNull();
        });

        return await knex('Salts').insert([{ Salt: bCrypt.genSaltSync(3) }]); // salt you moron.
    }

    createTableAndInsertSalt().then(() => {
        // is this returning a promise
        console.log('salted')
    }).catch(err => console.log(err)) // have to check your errors now
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Salts');
};
