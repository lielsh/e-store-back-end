const ProductSubCategory = require("../models/ProductSubCategory")
const ObjectId = require('mongoose').Types.ObjectId

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

        else if (JSON.parse(req.query.filter) && JSON.parse(req.query.filter).id) {

            if (ObjectId.isValid(JSON.parse(req.query.filter).id[0]))
                filterBy.id = JSON.parse(req.query.filter).id[0]
            
            else
                filterBy.name = JSON.parse(req.query.filter).id[0]
        }
    }

    ProductSubCategory.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' }, populate: [{path: 'category', model: "productsCategories", select: 'name -_id'}] }, (err, result) => {

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

    ProductSubCategory.findById(req.params.id, { _id: 0 }, { populate: [{path: 'category', model: "productsCategories", select: 'name id -_id'}] }, (err, result) => {

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

    const subcategory = {

        'id': '',
        'name': req.body.name,
        'category': req.body.category
    }

    ProductSubCategory.create(subcategory, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {

            result.id = String(result._id)

            ProductSubCategory.findByIdAndUpdate(result._id, result, (err, result) => {

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
  
    const subcategory = {
        
        'name': req.body.name,
        'category': req.body.category.id
    }

    ProductSubCategory.findByIdAndUpdate(req.params.id, subcategory, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

// exports.delete = (req, res) => {
        
//     ProductSubCategory.findByIdAndDelete(req.params.id, (err, result) => {

//         if (err) {
//             console.log(err)
//             return res.send(err)
//         }

//         else {
//             return res.send(result)
//         }
//     })
// }