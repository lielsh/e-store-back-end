const mongoose = require('mongoose')
require('../models/UserRole')
require('../models/UserAuthentication')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
    fname: {
        type: String,
        default: ""
    },
    lname: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    zipcode: {
        type: String,
        default: ""
    },
    photo: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersRoles",
        require: true,
        default: process.env.USERS_ROLES_CUSTOMER_ID
    },
    auth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersAuthentications",
        require: true,
        default: process.env.USERS_AUTHS_SITE_ID
    }
},{ versionKey: false })

UserSchema.statics.generateAccessToken = (userEmail) => {

    return jwt.sign(userEmail, process.env.BEARER_TOKEN_PRIVATE, {
        algorithm: process.env.JWT_ALGORITHM, expiresIn: '2d', audience: process.env.JWT_AUDIENCE, issuer: process.env.JWT_ISSUER
    })
}

module.exports = mongoose.model('users', UserSchema, 'users')