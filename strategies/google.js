const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH20_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH20_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH20_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    // Register user here.
    //console.log(profile)
    cb(null, profile)
  }
))