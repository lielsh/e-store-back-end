const Order = require("../models/Order")
const jwt = require('jsonwebtoken')

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

    Order.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' }, populate: [{path: 'uid', model: "users", select: 'id -_id'}, {path: 'productsInCart.prodId', model: "products", select: 'title -_id'}, {path: 'status', model: "ordersStatus", select: 'name id -_id'}] }, (err, result) => {

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

    Order.findOne({ id: req.params.id }, { _id: 0 }, { populate: [{path: 'uid', model: "users", select: 'id -_id'}, {path: 'productsInCart.prodId', model: "products", select: 'title -_id'}, {path: 'status', model: "ordersStatus", select: 'name id -_id'}] }, (err, result) => {

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

    const order = {

        'status': req.body.status.id
    }

    Order.findOneAndUpdate({ id: req.params.id }, order, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.addOnePrivate = (req, res) => {

    Order.create({...req.body.order, status: process.env.ORDERS_STATUS_RECEIVED_ID}, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result.id)
        }
    })
}

exports.findAllPrivate = (req, res) => {

    Order.find({ uid: req.body.user }, { _id: 0, uid: 0 }, { populate: [{path: 'productsInCart.prodId', model: "products", select: 'title -_id'}, {path: 'status', model: "ordersStatus", select: 'name -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)

            for (let i = 0 ; i < result.length ; i++) {
                
                const temp = {...result[i]}

                temp._doc.status = temp._doc.status.name

                result[i] = temp._doc
            }

            return res.send({ orders: result })
        }
    })
}
