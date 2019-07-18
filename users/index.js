const server = require('express').Router()
const db = require('../data/dbConfig')
const { authenticate } = require('../common/authentication')

// @route    /api//user/getAll
// @desc     GET ALL user
// @Access   Public
server.get('/All', async (req, res) => {
  try {
    // get user
    let user = await db
      .select('u.id', 'u.username', 'u.email', 'u.firstname', 'u.lastname')
      .from('users as u')

    const results = user.map(async (item) => {
      // get images from images table
      const images = await db
        .select('i.id', 'i.url')
        .from('images as i')
        .where({ id: item.id })

      item.avatar = images
      return item
    })

    // combine all operation
    Promise.all(results).then((completed) => {
      user = completed
      res.status(200).json({ user })
    })
    // desctructure message for better error
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

// @route    /api/user
// @desc     GET user by
// @Access   Public
server.get('/', authenticate, async (req, res) => {
  const { id } = req.decoded.user
  try {
    let user = await db
      .select()
      .from('users')
      .where({ id })

    const results = user.map(async (item) => {
      // get images from images table
      const images = await db
        .select()
        .from('images')
        .where({ id })

      item.avatar = images
      return item
    })

    // combine all operation
    Promise.all(results).then((completed) => {
      user = completed
      res.status(200).json({ user })
    })

    // error handling
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

module.exports = server
