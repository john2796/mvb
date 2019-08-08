const request = require('supertest')
const bcrypt = require('bcrypt')
const server = require('../server')
const db = require('../data/dbConfig')

// -------------- Testing USER ROUTES ---------------

describe('USER route CRUD', async () => {
  afterEach(async () => {
    await db
      .select()
      .from('users')
      .truncate()
  })

  beforeEach(() => {
    jest.setTimeout(15000)
  })
})
