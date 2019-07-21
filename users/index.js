const server = require('express').Router()
const db = require('../data/dbConfig')
const { authenticate } = require('../common/authentication')

// ------------------------------------------------------------
// @route    /api/user/getAll
// @desc     GET ALL user
// @Access   Public
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// @route    /api/user
// @desc     GET user account
// @Access   private
// ------------------------------------------------------------
// once you login and sent back token in the header for privates routes i will be able to decode those payload and use the id to find your account response with right data
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

//-----------------------------------------------------------
// @route    /api/user
// @desc     DELETE account only owner should be able to do this
// @Access   Private
//-----------------------------------------------------------
server.delete('/', authenticate, async (req, res) => {
  const { id } = req.decoded.user
  if (!id) {
    return res.status(400).json({ message: 'User with that id is not found' })
  }
  try {
    await db
      .delete()
      .from('users')
      .where({ id })
    res.status(204)
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

module.exports = server
