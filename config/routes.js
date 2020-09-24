const router = require('express').Router()
const auth = require('../controllers/auth')
const sellers = require('../controllers/sellers')
const secureRoute = require('../lib/secureRoute')

router.route('/signUp')
  .post(auth.signUp)

router.route('/signIn')
  .post(auth.signIn)

router.route('/sellers')
  .get(sellers.getAllSellers)

router.route('/sellers/:id')
  .get(sellers.sellerReviews)

router.route('/sellers/:id/reviews')
  .post(secureRoute, sellers.postReview)
  
router.route('/getNearestSellers')
  .get(sellers.getNearestSellers)


module.exports = router
