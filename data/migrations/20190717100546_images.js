exports.up = knex => knex.schema.createTable('images', (tbl) => {
  tbl.increments()
  tbl
    .integer('user_id')
    .notNullable()
    .references('id')
    .inTable('users')
  tbl.string('url').notNullable()
})

//  url, user_id

exports.down = knex => knex.schema.dropTableIfExists('images')
