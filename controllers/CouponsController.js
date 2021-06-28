const Coupon = require("../models/Coupon")

exports.findAllPublic = (req, res) => {
   

    Coupon.find({ active: true }, { _id: 0, id: 0 },  (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)
            return res.send(result)
        }
    })
}

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

    Coupon.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' } } , (err, result) => {

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
    
    Coupon.findById(req.params.id, { _id: 0 }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.addOne = (req, res) => {

    const coupon = {

        'id': '',
        'name': req.body.name.toUpperCase(),
        'discount': req.body.discount,
        'active': req.body.active
    }

    Coupon.create(coupon, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {

            result.id = String(result._id)

            Coupon.findByIdAndUpdate(result._id, result, (err, result) => {

                if (err) {
                    console.log(err)
                    return res.send(err)
                }
                
                else {
                    return res.send(result)
                }
            })                
        }
    })
}

exports.updateOne = (req, res) => {
    
    const coupon = {

        'name': req.body.name.toUpperCase(),
        'discount': req.body.discount,
        'active': req.body.active
    }

    Coupon.findByIdAndUpdate(req.params.id, coupon, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.delete = (req, res) => {
        
    Coupon.findByIdAndDelete(req.params.id, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}