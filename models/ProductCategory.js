const mongoose = require('mongoose')

const ProductCategorySchema = new mongoose.Schema({
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

module.exports = mongoose.model('productsCategories', ProductCategorySchema, 'productsCategories')