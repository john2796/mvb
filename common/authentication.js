const jwt = require('jsonwebtoken') // use for sign & verify

const jwtKey = process.env.JWT_SECRET || 'a really secure key'

/* GENERATE TOKEN TODO
1. store payload user param
2. store options token lifetime
3 return promise signing user payload
*/
const generateToken = (user) => {
  // user info
  const payload = {
    subject: user.id,
    user,
  }
  // expiration data for token
  const options = {
    expiresIn: 60 * 60 * 24 * 30, // token last 30 days
  }

  // return token if promise is resolve
  return new Promise((res, rej) => {
    jwt.sign(payload, jwtKey, options, (err, token) => {
      if (err) {
        rej(err)
      } else {
        res(token)
      }
    })
  })
}

/* AUTHENtiCATE TODO
 1. get token from Authorization
 2. check if token is valid
 3. verify token
 4. store data in req.decoded and let them pass next()
 5 else throw err
 */
const authenticate = (req, res, next) => {
  // grab token from authorization header
  const token = req.get('Authorization')

  // if token is valid
  if (token) {
    // verify user
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'You are not authorized! Please log in.' })
      req.decoded = decoded
      next()
    })
  } else {
    // else if there's error
    res.status(401).json({
      message: 'You are not authorized! Please log in.',
    })
  }
}

module.exports = {
  generateToken,
  authenticate,
}
