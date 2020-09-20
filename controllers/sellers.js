const axios = require('axios')
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
  console.log('review created')
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

const findClosestSeller = async (url) => {
  try {
    const res = await axios.get(url)
    console.log(res)
    return res
  } catch (err) {
    console.log(err)
    console.log('error of axios google maps')
    return 'failed'
  }
}


async function getNearestSellers(req, res, next) {

  let sellers
  let closestSeller
  // let currentDistance = {}
  let currentDistance

  const maxDistance = req.query.maxDistance
  let distance = maxDistance

  const latitude = req.query.latitude
  const longitude = req.query.longitude

  try {
    sellers = await User.find()
  } catch (err){
    console.log(err)
  }
  
  Promise.all(sellers.map(seller => {

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${latitude},${longitude}&destinations=${seller.latitude},${seller.longitude}&key=AIzaSyBvuOm74SiVKRVJMZRSOjC7F4kYOI7Q1p0`

    currentDistance = findClosestSeller(url)
    console.log('curentDistance1',currentDistance)

    // currentDistance = distance.data.rows[0].elements[0].distance.value
    // currentDistance = distance
    const currDistance = currentDistance

    if (currentDistance < distance){
      distance = currentDistance
      closestSeller = seller
    }
    // console.log('CurrentDistance2',currentDistance)
    console.log('CurrentDistance2',currDistance)
  }))

  if (distance > maxDistance) {
    res.status(400).json({ error: 'Can not find any sellers within the maxDistance provided' })
  }

  res.status(200).json(closestSeller)
  
}



module.exports = {
  getAllSellers, 
  postReview: sellersPostReview,
  sellerReviews: getSellerReviews,
  getNearestSellers
}