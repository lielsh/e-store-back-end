const mongoose = require('mongoose')
require('../models/ProductCategory')
require('../models/ProductSubCategory')
require('../models/ProductType')
require('../models/ProductBrand')

const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    },
    discount: {
        type: Boolean,
        required: true,
        default: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0.01,
        max: 0.99,
        default: 0.01
    },
    stock: {
        type: Boolean,
        required: true,
        default: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    details: [{
        type: String,
        required: true
    }],
    img: [{
        type: Object,
        required: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsCategories",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsSubCategories",
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsTypes",
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productsBrands",
        required: true
    }
},{ versionKey: false })

module.exports = mongoose.model('products', ProductSchema, 'products')