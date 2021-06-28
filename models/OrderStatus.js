const mongoose = require('mongoose')

const OrderStatusSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
},{ versionKey: false })

module.exports = mongoose.model('ordersStatus', OrderStatusSchema, 'ordersStatus')