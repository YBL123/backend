const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret  = process.env.JWT_SECRET

async function signUp(req, res) {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ message: `${user.email} has been registered` })
  } catch (err) {
    res.status(422).json(err)
  }
}
async function signIn(req, res) {
  try {
    console.log('user wanted: ', req.body)
    const user = await User.findOne({ email: req.body.email })
    console.log('user found: ', user)
    if (!user || !user.validatePassword(req.body.password)) {
      throw new Error()
    }
    const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '7 days' })
    
    res.status(202).json({ 
      message: `Welcome back ${user.name}`,
      token
    })

  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = {
  signUp, signIn
}