const mongoose = require('mongoose')

const UserAuthenticationSchema = new mongoose.Schema({
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

module.exports = mongoose.model('usersAuthentications', UserAuthenticationSchema, 'usersAuthentications')