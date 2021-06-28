const Ticket = require('../models/Ticket')
const transporter = require('../config/email.config')

exports.findAll = (req, res) => {
    
    let sortBy
    let orderBy
    let start = 0
    let end
    const filterBy = {}

    if (req.query && Object.keys(req.query).length > 0 && req.query.constructor === Object) {

        if (req.query.sort) {

            sortBy = JSON.parse(req.query.sort) ? JSON.parse(req.query.sort)[0] : null
            orderBy = JSON.parse(req.query.sort) ? JSON.parse(req.query.sort)[1] : null
        }

        if (req.query.range) {

            start = JSON.parse(req.query.range) ? JSON.parse(req.query.range)[0] : 0
            end = JSON.parse(req.query.range) ? JSON.parse(req.query.range)[1] + 1 : null
        }

        if (JSON.parse(req.query.filter) && JSON.parse(req.query.filter).q) {
            
            filterBy.name = { '$regex': new RegExp(JSON.parse(req.query.filter).q), $options: 'i' }
        }
    }

    Ticket.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' }, populate: [{path: 'status', model: "ticketsStatus", select: 'name -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)

            result = end ? result.slice(start, end) : result.slice(start, result.length + 1)

            return res.send(result)
        }
    })
}

exports.findOne = (req, res) => {

    Ticket.findById(req.params.id, { _id: 0 }, { populate: [{path: 'status', model: "ticketsStatus", select: 'name id -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.updateOne = (req, res) => {

    const ticket = {

        comments: req.body.comments,
        status : req.body.status.id
    }

    Ticket.findByIdAndUpdate(req.params.id, ticket, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.fromClient = (req, res) => {

    if (req.body.name && req.body.email && req.body.subject && req.body.message && req.body.datetime) {

        const email = {

            to: process.env.NODEMAILER_AUTH_USER,
            subject: req.body.subject,
            text:
                `
                from: ${req.body.email}
                
                content: ${req.body.message}
                
                name: ${req.body.name}

                datetime: ${req.body.datetime}
                `
            // html: `<h1>mail from ${from}</h1>`
        }

        transporter.sendMail(email, (err, result) => {

            if (err) {
                console.log(err)
                return res.send({ error: true, message: 'Connection failed, please try again later.' })
            }

            else {

                Ticket.create({ datetime: req.body.datetime, email: req.body.email, name: req.body.name, subject: req.body.subject, message: req.body.message, comments: "" }, (err, result) => {

                    if (err) {
                        console.log(err)
                        return res.send({ error: true, message: 'Connection failed, please try again later.' })
                    }

                    else {

                        result.id = String(result._id)

                        Ticket.findByIdAndUpdate(result._id, result, (err, result) => {
        
                            if (err) {
                                console.log(err)
                                return res.send({ error: true, message: 'Connection failed, please try again later.' })
                            }
                    
                            else {
                                return res.send({ message: 'Email was sent successfully.' })
                            }
                        })
                    }         
                })
            }
        })
    }
}