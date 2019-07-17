exports.up = knex => knex.schema.createTable('users', (tbl) => {
  tbl.increments() // id
  tbl
    .string('username')
    .unique()
    .notNullable()
  tbl
    .string('email')
    .unique()
    .notNullable()
  tbl.string('password').notNullable()
  tbl.string('firstname').notNullable()
  tbl.string('lastname').notNullable()
})

exports.down = knex => knex.schema.dropTableIfExists('users')
