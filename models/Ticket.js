const mongoose = require('mongoose')
require('../models/TicketStatus')

const TicketSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    datetime: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticketsStatus",
        require: true,
        default: process.env.TICKETS_STATUS_PENDING_ID
    }
},{ versionKey: false })

module.exports = mongoose.model('tickets', TicketSchema, 'tickets')