const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0.00,
        max: 1,
        default: 0.00
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
},{ versionKey: false })

module.exports = mongoose.model('coupons', CouponSchema, 'coupons')