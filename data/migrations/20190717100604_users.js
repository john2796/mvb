exports.up = knex => knex.schema.createTable('users', (tbl) => {
  tbl.increments() // id
  tbl
    .string('username')
    .unique()
    .notNullable()
  tbl.string('password').notNullable()
  tbl
    .string('avatar')
    .notNullable()
    .defaultsTo('https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg')
})

exports.down = knex => knex.schema.dropTableIfExists('users')
