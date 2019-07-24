// DOTENV ->>>>>>>>>>
require('dotenv').config()

const server = require('./server')
// port
const port = process.env.PORT || 5000
// 404
server.use((req, res) => res.status(404).send({ message: `Route Not Found: ${req.url}` }))
// 500
server.use((err, req, res) => res.status(500).json({ error: err }))
// listen for changes
server.listen(port, () => console.log(`Running on port : ${port}`))
