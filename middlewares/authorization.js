exports.public = (req, res, next) => {

    if (req.headers.authorization && (req.headers.authorization===process.env.BEARER_TOKEN_PUBLIC || req.headers.authorization===process.env.BEARER_TOKEN_ADMIN))
        next()

    else
        return res.render('error', { method: req.method, route: req.originalUrl.split("?")[0] })
}

exports.admin = (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization === process.env.BEARER_TOKEN_ADMIN)
        next()

    else
        return res.render('error', { method: req.method, route: req.originalUrl.split("?")[0] })
}

exports.thirdPartySignIn = (req, res, next) => {

    if (req.query.auth.split("%20").join(" ") === process.env.BEARER_TOKEN_PUBLIC )
        next()

    else
        return res.render('error', { method: req.method, route: req.originalUrl.split("?")[0] })
}