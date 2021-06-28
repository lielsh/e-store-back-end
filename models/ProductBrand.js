const mongoose = require('mongoose')

const ProductBrandSchema = new mongoose.Schema({
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

module.exports = mongoose.model('productsBrands', ProductBrandSchema, 'productsBrands')