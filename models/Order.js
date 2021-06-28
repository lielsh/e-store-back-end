const mongoose = require('mongoose')
require('../models/User')
require('../models/Product')
require('../models/OrderStatus')

const OrderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    datetime: {
        type: Date,
        required: true,
        default: new Date()
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: true,
    },
    total: {
        type: String,
        require: true
    },
    productsInCart: [{
        prodId: {
            type: mongoose.Schema.Types.ObjectId, ref: "products", require: true
        },
        prodQuantity: {
            type: Number, require: true
        }
    }],
    shipping: [{
        type: String,
        require: true
    }],
    payment: {
        type: String,
        require: true
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ordersStatus",
        require: true,
    },
    refund: {
        type: Boolean,
        require: true,
        default: false
    }
},{ versionKey: false })

module.exports = mongoose.model('orders', OrderSchema, 'orders')