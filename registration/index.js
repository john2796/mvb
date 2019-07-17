const express = require('express')
const bcrypt = require('bcrypt') // used for hashing

const { generateToken } = require('../common/authentication')
const db = require('../data/dbConfig')

const server = express.Router()

// @route    /api/registration/register
// @desc  Register NEW user
// @Access   Public
/* TODO
1. validate user input
2 hash password
3 insert user input to db
4. get user that we just inserted
5. generate token based on that new user
6. reponse with new user and token
7. handle erros
 */
server.post('/register', async (req, res) => {
  const {
    username, email, firstname, lastname,
  } = req.body
  let { password } = req.body

  // Validate user
  if (!username) {
    return res.status(400).json({ message: 'no username provided' })
  }
  if (!password) {
    return res.status(400).json({ message: 'no password provided' })
  }
  if (!email) {
    return res.status(400).json({ message: 'no email provided' })
  }
  if (!firstname) {
    return res.status(400).json({ message: 'no firstname provided' })
  }
  if (!lastname) {
    return res.status(400).json({ message: 'no lastname provided' })
  }

  try {
    // hash password
    password = await bcrypt.hash(password, 1)

    // Add user to db
    await db
      .insert({
        username,
        password,
        email,
        firstname,
        lastname,
      })
      .into('users')

    // get user
    const user = await db
      .select('u.username', 'u.id', 'u.firstname', 'u.lastname')
      .from('users as u')
      .where('u.username', username)
      .first()
    // generate token
    const token = await generateToken(user)

    // send response
    res.status(201).json({
      username: user.username,
      password: user.password,
      user_id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      token,
    })

    // catch errors
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

// @route    /api/registration/login
// @desc     Login User
// @Access   Public
/* Things todo:
 1. validate user input
 2. Get user
 3 check if user exists
 4 compare db password to user input password
 5 check if credential is right
 6 generate token when loging in
 7 response with user and token data
 8 check for errors
 */
server.post('/login', async (req, res) => {
  const { username, password } = req.body
  if (!username) {
    return res.status(400).json({ message: 'no username provided' })
  }
  if (!password) {
    return res.status(400).json({ message: 'no username provided' })
  }

  try {
    const user = await db
      .select()
      .from('users')
      .where({ username })
      .first()

    // Check if use exists
    if (user) {
      // check password
      const correct = await bcrypt.compare(password, user.password)

      if (!correct) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      // generate token
      const token = await generateToken(user)
      // send back response
      res.status(200).json({ user, token })
    }
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})
module.exports = server
