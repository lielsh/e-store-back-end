const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    zoom: {
        type: Number,
        required: true,
        max: 18,
        min: 0
    }
},{ versionKey: false })

module.exports = mongoose.model('contacts', ContactSchema, 'contacts')