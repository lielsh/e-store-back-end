const mongoose = require('mongoose')

const UserRoleSchema = new mongoose.Schema({
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

module.exports = mongoose.model('usersRoles', UserRoleSchema, 'usersRoles')