const passport = require('passport')
const User = require('../models/user')
const config = require('../.env/config')
const JwtStategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Verify email and password
  // Yes - Call done with user
  // No - Call done with false

  User.findOne({ email: email }, (err, user) => {
    console.log(user)
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false)
    }
    // compare passwords
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(`error in compare function`)
        return done(err)
      }
      if (!isMatch) {
        return done(null, false)
      }
      return done(null, user)
    })
  })
})

// Setup options for JWT Strategy
// Look in header
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret_key,
}

// create JWT Strategy
const jwtLogin = new JwtStategy(jwtOptions, function (payload, done) {
  // see if user ID exists in database
  // Yes - call Done with that user
  // No - Call done without a user
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false)
    }
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)
