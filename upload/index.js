const express = require('express')
const cloudinary = require('cloudinary')
const multipart = require('connect-multiparty')()

const { authenticate } = require('../common/authentication.js')

const db = require('../data/dbConfig')

const server = express.Router()

cloudinary.config({
  cloud_name: 'dhiayflin',
  api_key: '266536395857977',
  api_secret: 'nKC01YmIE-tSDADn4YdxiSYpj1Q',
})
// ------------------------------------------------------------
// @route    /api/upload
// @desc     For Testing
// @Access   Public
// ------------------------------------------------------------
server.get('/image', authenticate, async (req, res) => {
  try {
    const images = await db.select().from('images')
    res.status(200).json({ images })
  } catch ({ message }) {
    res.status(500).json({ message })
  }
})
// ------------------------------------------------------------
// @route    /api/upload/image
// @desc     POST Image
// @Access   Private
// ------------------------------------------------------------
server.post('/image', authenticate, multipart, (req, res) => {
  //  url, user_id
  const { id } = req.decoded.user
  // call cloudinary upload func
  cloudinary.v2.uploader.upload(req.files.url.path, async (error, result) => {
    // if there's error return message
    if (error) {
      res.status(500).json({ message: 'Upload failed' })
    } else {
      try {
        // add image
        await db.insert({ url: result.url, user_id: id }).into('images')
        // grab image data
        const image = await db
          .select()
          .from('images')
          .where({ url: result.url })
          .first()
        // response with new image
        res.status(201).json({ image })

        // handle error messages
      } catch ({ message }) {
        res.status(500).json({ message })
      }
    }
  })
})

module.exports = server
