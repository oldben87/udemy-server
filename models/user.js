const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// Define Model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
})

// On Save hook, encrypt password
// before saving a model, run this function:
userSchema.pre('save', function (next) {
  // access user model
  const user = this // user.email user.password

  // create salt & run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err)
    }
    // hash / password with salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err)
      }
      // overwrite plain text with encryption
      user.password = hash
      next()
    })
  })
})

//compare submitted password with database
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  console.log(`candidate: ${candidatePassword}`)
  console.log(`user.modelpassword: ${this.password}`)
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err)
    }
    callback(null, isMatch)
  })
}

// Create Model Class
const ModelClass = mongoose.model('user', userSchema)

// Export Model
module.exports = ModelClass
