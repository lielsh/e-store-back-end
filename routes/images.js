const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/:image', (req, res) => {

    const image = req.params.image

    res.sendFile(path.join(__dirname, '..', 'uploads', 'images', req.imagePath ,image), (err) => {

        if (err)
            return res.render('error', { method: req.method, route: req.originalUrl.split("?")[0] })
    })
})

module.exports = router
