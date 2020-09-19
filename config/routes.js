const router = require('express').Router()
const auth = require('../controllers/auth')

router.route('/signUp')
  .post(auth.signUp)

router.route('/signIn')
  .post(auth.signIn)


module.exports = router