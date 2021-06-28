const mongoose = require('mongoose')
require('../models/ProductSubCategory')

const ProductTypeSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsSubCategories",
        required: true
    }
},{ versionKey: false })

module.exports = mongoose.model('productsTypes', ProductTypeSchema, 'productsTypes')