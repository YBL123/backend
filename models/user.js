const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//* each comment has to fit this schema criteria
const reviewSchema = new mongoose.Schema({
  reviewValue: { type: Number, enum: [1, 2, 3, 4, 5], default: 1, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, maxlength: 50 },
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  address: { type: String, required: true, maxlength: 1000 },
  typeOfUser: { type: String, required: true, maxlength: 50 },
  profession: { type: String, required: true, maxlength: 500 },
  longitude: { type: Number, required: true, maxlength: 2000 },
  latitude: { type: Number, required: true, maxlength: 2000 },
  reviews: [reviewSchema]
})


// userSchema
//   .set('toJSON', {
//     virtuals: true, 
//     transform(doc, json) {
//       delete json.password
//       return json
//     }
//   })

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

userSchema
  .virtual('passwordConfirmation')
  .set(function(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function(next) {
    if (this.isModified('password') && this._passwordConfirmation !== this.password) {
      this.invalidate('passwordConfirmation', 'does not match')
    }
    next()
  })

userSchema
  .pre('save', function(next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8))
    }
    next()
  })

userSchema.plugin(require('mongoose-unique-validator'))

module.exports = mongoose.model('User', userSchema)

