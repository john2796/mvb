const request = require('supertest')
const bcrypt = require('bcrypt')
const server = require('../server')
const db = require('../data/dbConfig')
// --------------- REGISTER ROUTE ----------------------
describe('user registration', () => {
  afterEach(async () => {
    await db('users').truncate()
  })

  beforeEach(() => {
    jest.setTimeout(15000)
  })

  describe('register route', () => {
    it('should return a status code of 201 upon success', async (done) => {
      const response = await request(server)
        .post('/api/registration/register')
        .send({
          username: 'username',
          password: 'password',
          email: 'test@test.test',
          firstname: 'test',
          lastname: 'test',
        })

      expect(response.status).toBe(201)
      done()
    })
  })

  it('should return a status code of 400 if body is invalid', async (done) => {
    const response = await request(server)
      .post('/api/registration/register')
      .send({
        invalidNameExample: 'username',
        password: 'password',
        email: 'test@test.test',
        firstname: 'test',
        lastname: 'test',
      })

    expect(response.status).toBe(400)
    done()
  })

  it('should send back user name , id, and token if registration is successful', async () => {
    const response = await request(server)
      .post('/api/registration/register')
      .send({
        username: 'username',
        password: 'password',
        email: 'test@test.test',
        firstname: 'test',
        lastname: 'test',
      })

    expect(response.body.user_id).not.toBe(null)
    expect(response.body.username).not.toBe(null)
    expect(response.body.token).not.toBe(null)
  })

  it('should send status of 500 and message if username or email are duplicated', async () => {
    await db
      .insert({
        username: 'username',
        password: 'password',
        email: 'test@test.test',
        firstname: 'test',
        lastname: 'test',
      })
      .into('users')

    const response = await request(server)
      .post('/api/registration/register')
      .send({
        username: 'username',
        password: 'password',
        email: 'test@test.test',
        firstname: 'test',
        lastname: 'test',
      })
    expect(response.status).toBe(500)
  })
  // --------------- LOGIN ROUTE ----------------------
  describe('login route', () => {
    beforeEach(async () => {
      await db
        .insert({
          username: 'user2',
          password: bcrypt.hashSync('pass', 1),
          email: '123123@whitehouse.gov',
          firstname: 'test',
          lastname: 'test',
        })
        .into('users')
    })

    it('should return status code of 200 upon success', async () => {
      const response = await request(server)
        .post('/api/registration/login')
        .send({
          username: 'user2',
          password: 'pass',
        })

      expect(response.status).toBe(200)
    })

    it('should return status code of 400 if body is invalid', async () => {
      const response = await request(server)
        .post('/api/registration/login')
        .send({
          usernaame: 'user2',
          password: 'pass',
        })
      expect(response.body.message).toBe('no username provided')
      expect(response.status).toBe(400)
    })

    it('should return status code of 401 if wrong credentials are entered', async () => {
      const response = await request(server)
        .post('/api/registration/login')
        .send({
          username: 'user2',
          password: 'passsss',
        })
      expect(response.status).toBe(401)
    })
  })
})
