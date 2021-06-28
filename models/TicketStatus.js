const mongoose = require('mongoose')

const TicketStatusSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ticketsStatus', TicketStatusSchema, 'ticketsStatus')