const jwt = require('jsonwebtoken')
const User = require('../models/user')
const secret  = process.env.JWT_SECRET

async function secureRoute(req, res, next) {
  try {
    if (!req.headers.authorization) throw new Error()

    const token = req.headers.authorization.replace('Bearer ', '')

    const payload = await jwt.verify(token, secret)

    const user = await User.findById(payload.sub)

    if (!user) throw new Error()
    console.log('user is ', user)

    req.currentUser = user

    next()
    
  } catch (err) {
    res.status(401).json( { message: 'Unauthorized' } )
  }
}


module.exports = secureRoute