const server = require('express').Router()
const multipart = require('connect-multiparty')()
const db = require('../data/dbConfig')

const uploadImage = require('../common/upload')
const { authenticate } = require('../common/authentication')

// ------------------------------------------------------------
// @route    /api/user/getAll
// @desc     GET ALL user
// @Access   Public
// ------------------------------------------------------------
server.get('/All', async (req, res) => {
  try {
    const user = await db('users')
    res.json({ user })
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

// ------------------------------------------------------------
// @route    /api/user
// @desc     GET user account
// @Access   private
// ------------------------------------------------------------
const returnCurrent = async (id, res) => {
  try {
    const user = await db('users')
      .where({ id })
      .first()


    res.json({ user })

    // error handling
  } catch ({ message }) {
    res.status(500).json({ message })
  }
}
// once you login and sent back token in the header for privates routes i will be able to decode those payload and use the id to find your account response with right data\
//-----------------------------------------------------------
// @route    /api/user/current
// @desc     Get current user
// @Access   Public
//-----------------------------------------------------------
server.get('/current', authenticate, (req, res) => {
  const { id } = req.decoded.user
  returnCurrent(id, res)
})

//-----------------------------------------------------------
// @route    /api/user
// @desc     Update user detail
// @Access   Public
//-----------------------------------------------------------
server.put('/', authenticate, multipart, async (req, res) => {
  const { username } = req.body
  const { id } = req.decoded.user
  try {
    // upload image
    const { secure_url } = await uploadImage(req)
    // update changes
    await db('users')
      .update({ avatar: secure_url, username })
      .where({ id })
    // return updated changes with current user
    returnCurrent(id, res)
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
  try {
    await db
      .delete()
      .from('users')
      .where({ id })

    // returnCurrent(id, res)
    res.json({ message: 'user deleted successfully' })
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})

module.exports = server
