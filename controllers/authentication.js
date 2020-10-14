const jwt = require('jwt-simple')
const config = require('../.env/config')
const User = require('../models/user')

function tokenForUser(user) {
  const timeStamp = new Date().getTime()

  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret_key)
}

exports.signin = (req, res, next) => {
  // user had email and password auth'd, they need a token
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = function (req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide an email and password' })
  }

  // see if email already exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err)
    }
    // if user exists return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email in use' })
    }

    // if user does not exist create & save a record
    const user = new User({
      email: email,
      password: password,
    })
    user.save((err) => {
      if (err) {
        return next(err)
      }

      // respond to request indicating it was successful with a token
      res.json({ token: tokenForUser(user) })
    })
  })
}
