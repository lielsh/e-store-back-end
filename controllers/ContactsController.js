Contact = require('../models/Contact')

const fs =  require('fs')
const path = require('path')

exports.findAllPublic = (req, res) => {

    Contact.find({}, { _id: 0, id: 0 }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: err})
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)

            const temp = {...result[0]._doc}
            temp.logo = `${process.env.PUBLIC_IMAGES_LOGOS}${temp.logo}`

            return res.send([temp])
        }
    })
}

exports.findAll = (req, res) => {

    Contact.find({}, { _id: 0 }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            res.setHeader('Content-Range', `${result.length}`)

            const temp = {...result[0]._doc}
            temp.logo = `${process.env.PUBLIC_IMAGES_LOGOS}${temp.logo}`

            return res.send([temp])
        }
    })
}

exports.findOne = (req, res) => {

    Contact.findById(req.params.id, { _id: 0, logo: 0 }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else { 
            const temp = {...result._doc}
            temp.logo = `${process.env.PUBLIC_IMAGES_LOGOS}${temp.logo}`

            return res.send(temp)
        }
    })
}

exports.updateOne = (req, res) => {

    const { logo, ...contact } = req.body;

    if (req.body.pictures) {

        contact.logo = req.body.pictures[0].title

        const image = req.body.pictures[0].src
        const match = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        const buffer = Buffer.from(match[2], 'base64')

        fs.writeFile(path.join(__dirname, '..', 'uploads', 'images', 'logos', req.body.pictures[0].title), buffer , { flag: 'wx' }, (err) => {

            if(err)
                console.log(err)
        })
    }

    Contact.findByIdAndUpdate(req.params.id, contact, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}