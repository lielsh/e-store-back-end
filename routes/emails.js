const express = require('express')
const router = express.Router()

const { public } = require('../middlewares/authorization')

const TicketsController = require('../controllers/TicketsController')

router.post('/from-client', public, TicketsController.fromClient)

module.exports = router
