require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const logger = require('./lib/logger')
const router = require('./config/routes')
const port = process.env.PORT || 8000
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/plants-db3'

mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) return console.log(err)
    console.log('Mongo is Connected')
  }
)

//! needs to be at the top
//* __dirname is a magic word meaning the directory your currently in. As after deployment the exact path will be different.
// app.use(express.static(`${__dirname}/frontend/build`))

app.use(bodyParser.json())

app.use(logger)

app.use('/api', router)

//! has to go underneath registering
//* * on any routes. If not routes match use this.
//* if any requests attempted that are not api we are sendign a res.sendFile(`${__dirname}/frontend/build/index.html)
// app.use('/*', (req, res) => res.sendFile(`${__dirname}/frontend/build/index.html`))


app.listen(port, () => console.log(`App is listening on port ${port}`))