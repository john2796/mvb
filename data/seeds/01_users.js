exports.seed = (knex) => {
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert([
        {
          username: 'test1',
          password: 'pass',
        },
        {
          username: 'test2',
          password: 'pass',
        },
        {
          username: 'test3',
          password: 'pass',
        },
        {
          username: 'test4',
          password: 'pass',
        },
        {
          username: 'test5',
          password: 'pass',
        },
        {
          username: 'test6',
          password: 'pass',
        },
      ])
    })
}
