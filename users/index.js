const server = require('express').Router()
const db = require('../data/dbConfig')

// @route    /api/user
// @desc     GET user
// @Access   Public
server.get('/', async (req, res) => {
  try {
    const users = await db.select().from('users')
    res.status(200).json({ users })
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

module.exports = server
