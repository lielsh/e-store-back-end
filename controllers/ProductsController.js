const Product = require("../models/Product")

const fs =  require('fs')
const path = require('path')

const addPictures = (images, pictures) => {

    for (let picture of pictures) {

        images[images.length] = {'title': picture.title, 'active': true}

        const image = picture.src
        const match = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        const buffer = Buffer.from(match[2], 'base64')

        fs.writeFile(path.join(__dirname, '..', 'uploads', 'images', 'products', picture.title), buffer , { flag: 'wx' }, (err) => {
            if(err)
                console.log(err)
        })
    }

    return images
}

exports.findAllPublic = (req, res) => {

    const limit = req.query.limit ? Number.parseInt(req.query.limit) : 0

    Product.find({ img: { $elemMatch: { active: true } } }, { _id: 0 }, { limit, populate: [{path: 'category', model: "productsCategories", select: 'name -_id'}, {path: 'subcategory', model: "productsSubCategories", select: 'name -_id'}, {path: 'type', model: "productsTypes", select: 'name -_id'}, {path: 'brand', model: "productsBrands", select: 'name -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)

            for (let i = 0 ; i < result.length ; i++) {
                
                const temp = {...result[i]}
                
                temp._doc.img = temp._doc.img.map(elem => `${process.env.PUBLIC_IMAGES_PRODUCTS}${elem.title}`)
                
                temp._doc.category = temp._doc.category.name
                temp._doc.subcategory = temp._doc.subcategory.name
                temp._doc.type = temp._doc.type.name
                temp._doc.brand = temp._doc.brand.name

                result[i] = temp._doc
            }

            return res.send(result)
        }
    })

}

exports.findOnePublic = (req, res) => {

    Product.findOne({ _id: req.params.id, img: { $elemMatch: { active: true } }}, { _id: 0 }, { populate: [{path: 'category', model: "productsCategories", select: 'name -_id'}, {path: 'subcategory', model: "productsSubCategories", select: 'name -_id'}, {path: 'type', model: "productsTypes", select: 'name -_id'}, {path: 'brand', model: "productsBrands", select: 'name -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            const temp = {...result}

            temp._doc.img = temp._doc.img.title

            temp._doc.category = temp._doc.category.name
            temp._doc.subcategory = temp._doc.subcategory.name
            temp._doc.type = temp._doc.type.name
            temp._doc.brand = temp._doc.brand.name

            return res.send(temp._doc)
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
            
            filterBy.title = { '$regex': new RegExp(JSON.parse(req.query.filter).q), $options: 'i' }
        }
    }

    Product.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' }, populate: [{path: 'category', model: "productsCategories", select: 'name -_id'}, {path: 'subcategory', model: "productsSubCategories", select: 'name -_id'}, {path: 'type', model: "productsTypes", select: 'name -_id'}, {path: 'brand', model: "productsBrands", select: 'name -_id'}] }, (err, result) => {

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

    Product.findById(req.params.id, { _id: 0 }, { populate: [{path: 'category', model: "productsCategories", select: 'name id -_id'}, {path: 'subcategory', model: "productsSubCategories", select: 'name id -_id'}, {path: 'type', model: "productsTypes", select: 'name id -_id'}, {path: 'brand', model: "productsBrands", select: 'name id -_id'}] }, (err, result) => {

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

    const images = []

    const product = {

        'id': '',
        'name': req.body.name,
        'title': req.body.title,
        'subtitle': req.body.subtitle || "",
        'price':  req.body.price,
        'discount': req.body.discount,
        'discountPercentage': req.body.discountPercentage,
        'stock': req.body.stock,
        'rating': req.body.rating,
        'details': req.body.details,
        'category': req.body.category,
        'subcategory': req.body.subcategory,
        'type': req.body.type,
        'brand': req.body.brand 
    }

    product.img = addPictures(images, req.body.pictures)

    Product.create(product, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {

            result.id = String(result._id)

            Product.findByIdAndUpdate(result._id, result, (err, result) => {

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

    const images = req.body.img

    const product = {

        'name': req.body.name,
        'title': req.body.title,
        'subtitle': req.body.subtitle || "",
        'price':  req.body.price,
        'discount': req.body.discount,
        'discountPercentage': req.body.discountPercentage,
        'stock': req.body.stock,
        'rating': req.body.rating,
        'details': req.body.details,
        'category': req.body.category.id,
        'subcategory': req.body.subcategory.id,
        'type': req.body.type.id,
        'brand': req.body.brand.id
    }

    if (req.body.pictures)
        product.img = addPictures(images, req.body.pictures)

    else
        product.img = images

    Product.findByIdAndUpdate(req.params.id, product, { runValidators: true }, (err, result) => {

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
        
    Product.findByIdAndDelete(req.params.id, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}