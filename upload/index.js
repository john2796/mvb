const express = require('express')
const cloudinary = require('cloudinary')
const multipart = require('connect-multiparty')()

const db = require('../data/dbConfig')

const server = express.Router()

cloudinary.config({
  cloud_name: 'dhiayflin',
  api_key: '266536395857977',
  api_secret: 'nKC01YmIE-tSDADn4YdxiSYpj1Q',
})

server.post('/image', multipart, (req, res) => {
  const { userId } = req.body

  cloudinary.v2.uploader.upload(req.files.image.path, async (error, result) => {
    if (error) {
      res.status(500).json({ message: 'Upload failed' })
    } else {
      try {
        if (!userId) {
          await db.insert({ url: result.url }).into('images')
          const image = await db
            .select()
            .from('images')
            .where({ url: result.url })
            .first()
          res.status(201).json({ id: image.id })
        }
      } catch (err) {
        res.status(500).json({ message: err })
      }
    }
  })
})

module.exports = server
