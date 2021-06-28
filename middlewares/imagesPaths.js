const express = require('express')
const router = express.Router()

const paths = ['products', 'logos', 'avatars']

router.get('/:path', (req, res, next) => {

    if (paths.indexOf(req.baseUrl.split("/")[2]) !== -1) {

        req.imagePath = req.baseUrl.split("/")[2]

        next()
    }
})

module.exports = router