const mongoose = require('mongoose')
require('../models/ProductCategory')

const ProductSubCategorySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsCategories",
        required: true
    }
},{ versionKey: false })

module.exports = mongoose.model('productsSubCategories', ProductSubCategorySchema, 'productsSubCategories')