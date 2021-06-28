const express = require('express')
const router = express.Router()

const { admin } = require('../middlewares/authorization')

const ContactsController = require('../controllers/ContactsController')
const CouponsController = require('../controllers/CouponsController')
const OrdersController = require('../controllers/OrdersController')
const OrdersControllerStatus = require('../controllers/OrdersControllerStatus')
const ProductsController = require('../controllers/ProductsController')
const ProductsControllerBrands = require('../controllers/ProductsControllerBrands')
const ProductsControllerCategories = require('../controllers/ProductsControllerCategories')
const ProductsControllerSubCategories = require('../controllers/ProductsControllerSubCategories')
const ProductsControllerTypes = require('../controllers/ProductsControllerTypes')
const TicketsController = require('../controllers/TicketsController')
const TicketsControllerStatus = require('../controllers/TicketsControllerStatus')
const UsersController = require('../controllers/UsersController')
const UsersControllerAuthentications = require('../controllers/UsersControllerAuthentications')
const UsersControllerRoles = require('../controllers/UsersControllerRoles')

// Contacts API
router.get('/contacts', admin, ContactsController.findAll)
router.get('/contacts/:id', admin, ContactsController.findOne)
router.put('/contacts/:id', admin, ContactsController.updateOne)

// Coupons API
router.get('/coupons', admin, CouponsController.findAll)
router.get('/coupons/:id', admin, CouponsController.findOne)
router.post('/coupons', admin, CouponsController.addOne)
router.put('/coupons/:id', admin, CouponsController.updateOne)
router.delete('/coupons/:id', admin, CouponsController.delete)

// Orders API
router.get('/orders', admin, OrdersController.findAll)
router.get('/orders/:id', admin, OrdersController.findOne)
router.put('/orders/:id', admin, OrdersController.updateOne)

// Orders Status API
router.get('/orders-status', admin, OrdersControllerStatus.findAll)
router.get('/orders-status/:id', admin, OrdersControllerStatus.findOne)
router.post('/orders-status', admin, OrdersControllerStatus.addOne)
router.put('/orders-status/:id', admin, OrdersControllerStatus.updateOne)

// Products API
router.get('/products', admin, ProductsController.findAll)
router.get('/products/:id', admin, ProductsController.findOne)
router.post('/products', admin, ProductsController.addOne)
router.put('/products/:id', admin, ProductsController.updateOne)
router.delete('/products/:id', admin, ProductsController.delete)

// Products Brands API
router.get('/products-brands', admin, ProductsControllerBrands.findAll)
router.get('/products-brands/:id', admin, ProductsControllerBrands.findOne)
router.post('/products-brands', admin, ProductsControllerBrands.addOne)
router.put('/products-brands/:id', admin, ProductsControllerBrands.updateOne)
// router.delete('/products-brands/:id', admin, ProductsControllerBrands.delete)

// Products Categories API
router.get('/products-categories', admin, ProductsControllerCategories.findAll)
router.get('/products-categories/:id', admin, ProductsControllerCategories.findOne)
router.post('/products-categories', admin, ProductsControllerCategories.addOne)
router.put('/products-categories/:id', admin, ProductsControllerCategories.updateOne)
// router.delete('/products-categories/:id', admin, ProductsControllerCategories.delete)

// Products Sub-Categories API
router.get('/products-subcategories', admin, ProductsControllerSubCategories.findAll)
router.get('/products-subcategories/:id', admin, ProductsControllerSubCategories.findOne)
router.post('/products-subcategories', admin, ProductsControllerSubCategories.addOne)
router.put('/products-subcategories/:id', admin, ProductsControllerSubCategories.updateOne)
// router.delete('/products-subcategories/:id', admin, ProductsControllerSubCategories.delete)

// Products Types API
router.get('/products-types', admin, ProductsControllerTypes.findAll)
router.get('/products-types/:id', admin, ProductsControllerTypes.findOne)
router.post('/products-types', admin, ProductsControllerTypes.addOne)
router.put('/products-types/:id', admin, ProductsControllerTypes.updateOne)
// router.delete('/products-types/:id', admin, ProductsControllerTypes.delete)

// Tickets API
router.get('/tickets', admin, TicketsController.findAll)
router.get('/tickets/:id', admin, TicketsController.findOne)
router.put('/tickets/:id', admin, TicketsController.updateOne)

// Tickets Status API
router.get('/tickets-status', admin, TicketsControllerStatus.findAll)
router.get('/tickets-status/:id', admin, TicketsControllerStatus.findOne)
router.put('/tickets-status/:id', admin, TicketsControllerStatus.updateOne)

// Users API
router.get('/users', admin, UsersController.findAll)
router.get('/users/:id', admin, UsersController.findOne)
router.post('/users', admin, UsersController.addOne)
router.put('/users/:id', admin, UsersController.updateOne)

// Users Authentications API
router.get('/users-auths', admin, UsersControllerAuthentications.findAll)
router.get('/users-auths/:id', admin, UsersControllerAuthentications.findOne)
router.post('/users-auths', admin, UsersControllerAuthentications.addOne)
router.put('/users-auths/:id', admin, UsersControllerAuthentications.updateOne)
// router.delete('/users-auths/:id', admin, UsersControllerAuthentications.delete)

// Users Roles API
router.get('/users-roles', admin, UsersControllerRoles.findAll)
router.get('/users-roles/:id', admin, UsersControllerRoles.findOne)
router.post('/users-roles', admin, UsersControllerRoles.addOne)
router.put('/users-roles/:id', admin, UsersControllerRoles.updateOne)
// router.delete('/users-roles/:id', admin, UsersControllerRoles.delete)

module.exports = router