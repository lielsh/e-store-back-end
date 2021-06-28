const express = require('express')
const router = express.Router()
const expressJwt = require('express-jwt')
const passport = require("passport")
require('../strategies/google')

const { public, thirdPartySignIn } = require('../middlewares/authorization')
const { signUpValidator, signInValidator } = require('../middlewares/validation')

const OrdersController = require('../controllers/OrdersController')
const UsersController = require('../controllers/UsersController')

const jwt = expressJwt({

    secret: process.env.BEARER_TOKEN_PRIVATE,
    algorithms: [process.env.JWT_ALGORITHM],
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    getToken: (req) => req.body.token
})

// Orders API
router.post('/add-order', public, jwt, OrdersController.addOnePrivate)
router.post('/get-orders', public, jwt, OrdersController.findAllPrivate)

// Users API
router.post('/sign-up', public, signUpValidator, UsersController.signUp)
router.post('/sign-in', public, signInValidator, UsersController.signIn)
router.post('/user-name', public, jwt, UsersController.findOneNamePrivate)
router.post('/user-data', public, jwt, UsersController.findOneDataPrivate)
router.put('/user-update/:id', public, jwt, UsersController.updateOnePrivate)
router.put('/user-delete-avatar/:id', public, jwt, UsersController.deleteAvatarPrivate)
router.get('/sign-in-google', thirdPartySignIn, passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account'}))
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res, next) => { req.user.emails[0].verified ? next() : null }, UsersController.signInGoogle)

module.exports = router