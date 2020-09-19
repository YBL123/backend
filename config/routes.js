const router = require('express').Router()
const auth = require('../controllers/auth')
const user = require('../controllers/users')

router.route('/signUp')
  .post(auth.signUp)

router.route('/signIn')
  .post(auth.signIn)


module.exports = router