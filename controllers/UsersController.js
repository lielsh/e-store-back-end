const User = require("../models/User")
const ObjectId = require('mongoose').Types.ObjectId

const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const fs =  require('fs')
const path = require('path')

const addPicture = (title, picture) => {

    const match = picture.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    const buffer = Buffer.from(match[2], 'base64')

    fs.writeFile(path.join(__dirname, '..', 'uploads', 'images', 'avatars', title), buffer , { flag: 'w' }, (err) => {
        if(err)
            console.log(err)
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

        else if (JSON.parse(req.query.filter) && JSON.parse(req.query.filter).id) {

            if (ObjectId.isValid(JSON.parse(req.query.filter).id[0]))
                filterBy.id = JSON.parse(req.query.filter).id[0]
            
            else
                filterBy.name = JSON.parse(req.query.filter).id[0]
        }
    }

    User.find(filterBy, { _id: 0 }, { sort: { [sortBy]: orderBy }, collation: { locale: 'en' }, populate: [{path: 'role', model: "usersRoles", select: 'name -_id'}, {path: 'auth', model: "usersAuthentications", select: 'name -_id'}] }, (err, result) => {

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

    User.findById(req.params.id, { _id: 0 }, { populate: [{path: 'role', model: "usersRoles", select: 'name id -_id'}, {path: 'auth', model: "usersAuthentications", select: 'name id-_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.addOne = async (req, res) => {

    try {

        const user = {...req.body}

        const hash = await argon2.hash('111111')
        const hashedPassword = hash.split(process.env.ARGON2_SPLIT)[1]

        user.id = ""
        user.password = hashedPassword
        user.role = user.role.name

        User.create(user, (err, result) => {

            if (err) {
                console.log(err)
                return res.send(err)
            }
    
            else {

                result.id = String(result._id)

                User.findByIdAndUpdate(result._id, result, (err, result) => {

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

    catch (err) {

        console.log(err)
        return res.send({ error: true, message: 'Connection failed, please try again later.' })
    }
}

exports.updateOne = (req, res) => {

    const user = {...req.body}
    
    user.role = user.role.id

    User.findByIdAndUpdate(req.params.id, user, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {
            return res.send(result)
        }
    })
}

exports.signUp = async (req, res) => {
    
    try {

        const hash = await argon2.hash(req.body.password)
        const hashedPassword = hash.split(process.env.ARGON2_SPLIT)[1]

        const user = {

            id: "",
            email: req.body.email,
            password: hashedPassword
        }

        User.create(user, (err, result) => {

            if (err) {
                console.log(err)
                return res.send({ error: true, message: 'The email address is already in use by another account.' })
            }
    
            else {

                result.id = String(result._id)

                User.findByIdAndUpdate(result._id, result, (err, result) => {

                    if (err) {
                        console.log(err)
                        return res.send({ error: true, message: err })
                    }
            
                    else {
                        return res.send({ error: false })
                    }
                })
            }
        })

    }

    catch (err) {

        console.log(err)
        return res.send({ error: true, message: 'Connection failed, please try again later.' })
    }
}

exports.signIn = (req, res) => {
    
    User.findOne({ email: req.body.email },  async (err, result) =>{

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else if (!result)
            return res.send({ error: true, message: 'Invalid email or password.' })

        else if (result && !result.active)
            return res.send({ error: true, message: 'This user has been disabled due to inactivity.<br>Please contact with the store for reactivating.' })

        else {
            
            try {

                if (await argon2.verify(`${process.env.ARGON2_SETTINGS}${result.password}`, req.body.password)) {
                  
                    const token = User.generateAccessToken({ email: req.body.email })
                    
                    return res.send({ user: { email: result.email, name: result.fname }, token })
                }

                else {
                    console.log(err)
                    return res.send({ error: true, message: 'Invalid email or password.' })
                }
            }

            catch (err) {
                console.log(err)
                return res.send({ error: true, message: 'Connection failed, please try again later.' })
            } 
        }
    })
}

exports.findOneNamePrivate = (req, res) => {

    const decryptedToken = jwt.verify(req.body.token, process.env.BEARER_TOKEN_PRIVATE)
    
    User.findOne({ email: decryptedToken.email }, 'email fname active -_id', (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else if (result && !result.active)
            return res.send({ error: true, message: 'This user has been disabled due to inactivity.\nPlease contact with the store for reactivating.' })

        else {
            const name = result.fname || result.email
            return res.send({ name })
        }
    })
}

exports.findOneDataPrivate = (req, res) => {

    const decryptedToken = jwt.verify(req.body.token, process.env.BEARER_TOKEN_PRIVATE)
    
    User.findOne({ email: decryptedToken.email }, { _id: 0, password: 0 }, { populate: [{path: 'role', model: "usersRoles", select: 'name -_id'}, {path: 'auth', model: "usersAuthentications", select: 'name -_id'}] }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else if (result && !result.active)
            return res.send({ error: true, message: 'This user has been disabled due to inactivity.\nPlease contact with the store for reactivating.' })

        else {
            
            const user = {...result}

            user._doc.role = user._doc.role.name

            return res.send({ user: user._doc })
        }
    })
}

exports.updateOnePrivate = (req, res) => {

    const user = {...req.body.user}

    if (user.photo) {

        addPicture(user.photo.title, user.photo.picture)

        user.photo = user.photo.title
    }

    User.findByIdAndUpdate(req.params.id, user, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else {
            return res.send({ message: 'The profile has been updated successfully.' })
        }
    })
}


exports.signInGoogle = (req, res) => {

    const user = {
        email: req.user.emails[0].value,
        auth: process.env.USERS_AUTHS_GOOGLE_ID
    }

    User.find(user, (err, result) => {

        if (err) {
            console.log(err)
            return res.send(err)
        }

        else {

            if (result.length) {

                const token = User.generateAccessToken({ email: user.email })
              
                return res.redirect(`${process.env.JWT_AUDIENCE}sign-in-up?email=${result.email}&name=${result.fname}&token=${token}`) 
            }

            else {

                User.create(user, (err, result) => {

                    if (err) {
                        console.log(err)
                        return res.send(err)
                    }
            
                    else {
        
                        result.id = String(result._id)
        
                        User.findByIdAndUpdate(result._id, result, (err, result) => {
        
                            if (err) {
                                console.log(err)
                                return res.send(err)
                            }
                    
                            else {
                                
                                const token = User.generateAccessToken({ email: user.email })
              
                                return res.redirect(`${process.env.JWT_AUDIENCE}sign-in-up?email=${result.email}&name=${result.fname}&token=${token}`) 
                            }
                        })
                    }
                })
            }
        }
    })
}

exports.deleteAvatarPrivate = (req, res) => {

    User.findByIdAndUpdate(req.params.id, { photo: "" }, { runValidators: true }, (err, result) => {

        if (err) {
            console.log(err)
            return res.send({ error: true, message: 'Connection failed, please try again later.' })
        }

        else {
            return res.send({ message: 'The profile has been updated successfully.' })
        }
    })
}