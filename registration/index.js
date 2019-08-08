const express = require('express')
const bcrypt = require('bcrypt') // used for hashing

const { generateToken } = require('../common/authentication')
const db = require('../data/dbConfig')

const server = express.Router()

/* TODO
1. validate user input
2 hash password
3 insert user input to db
4. get user that we just inserted
5. generate token based on that new user
6. reponse with new user and token
7. handle erros
 */
//-----------------------------------------------------------
// @route    /api/auth/register
// @desc     Register new User
// @Access   Public
//-----------------------------------------------------------
server.post('/register', async (req, res) => {
  const { username } = req.body
  let { password } = req.body

  // Validate user
  if (!username) {
    return res.status(400).json({ message: 'no username provided' })
  }
  if (!password) {
    return res.status(400).json({ message: 'no password provided' })
  }

  try {
    // hash password
    password = await bcrypt.hash(password, 1)

    // Add user to db
    await db
      .insert({
        username,
        password,
      })
      .into('users')

    // get user
    const user = await db
      .select()
      .from('users as u')
      .where('u.username', username)
      .first()
    // generate token
    const token = await generateToken(user)

    // send response
    res.status(201).json({
      user,
      token,
    })

    // catch errors
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

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

//-----------------------------------------------------------
// @route    /api/auth/login
// @desc     Login User
// @Access   Public
//-----------------------------------------------------------
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
