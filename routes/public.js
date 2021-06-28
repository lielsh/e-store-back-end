const express = require('express')
const router = express.Router()

const { public } = require('../middlewares/authorization')

const ContactsController = require('../controllers/ContactsController')
const CouponsController = require('../controllers/CouponsController')
const ProductsController = require('../controllers/ProductsController')

// Contacts API
router.get('/contacts', public, ContactsController.findAllPublic)

// Coupons API
router.get('/coupons', public, CouponsController.findAllPublic)

// Products API
router.get('/products', public, ProductsController.findAllPublic)
router.get('/products/:id', public, ProductsController.findOnePublic)

module.exports = router