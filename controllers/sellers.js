const User = require('../models/user')

async function getAllSellers(req, res) {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.json(err)
  }
}

// * POST - body = { a valid review object }
// * URL - api/sellers/:id/reviews
async function sellersPostReview(req, res, next) {
  // console.log('review created')
  console.log(req.body)
  try {
    // * Find the review that we are creating a review on
    req.body.user = req.currentUser
    const sellerId = req.params.id
    const seller = await User.findById(sellerId)
    if (!seller) throw new Error('notFound')
    // * attach our review object(sent in the request body) to that seller, pushing into its reviews array
    seller.reviews.push(req.body)
    console.log(seller)
    console.log(req.body)
    // * resave that seller with the new reviews
    await seller.save()
    // * send back that seller in response, with new review present
    res.status(201).json(seller)
  } catch (err) {
    next(err)
  }
}

async function getSellerReviews(req, res) {
  const sellerId = req.params.id
  try {
    const seller = await (await User.findById(sellerId)).populate({
      path: 'reviews.user',
      model: 'User'
    })
    if (!seller) throw new Error('notFound')
    const user = await User.findById(seller.user)
    seller.user = user
    res.status(200).json(seller)
  } catch (err) {
    res.status(422).json(err)
  }
}

module.exports = {
  getAllSellers, 
  postReview: sellersPostReview,
  sellerReviews: getSellerReviews
}