const emailValidator = (email) => {

    // https://github.com/manishsaraan/email-validator/blob/master/index.js

    const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!email) return false

    const emailParts = email.split('@')
  
    if (emailParts.length !== 2) return false
  
    const account = emailParts[0]
    const address = emailParts[1]
  
    if (account.length > 64) return false
  
    else if (address.length > 255) return false
  
    const domainParts = address.split('.')
  
    if (domainParts.some(part => {
      return part.length > 63
    })) return false
  
    if (!tester.test(email)) return false
  
    return true
}

exports.signUpValidator = (req, res, next) => {

    if (req.body.email && req.body.password) {

        if (emailValidator(req.body.email) && req.body.password.length > 5)
            next()

        else if (!emailValidator(req.body.email))
            return res.send({ error: true, message: "The email address is badly formatted." })
        
        else if (emailValidator(req.body.email) && req.body.password.length <= 5)
            return res.send({ error: true, message: "Password should be at least 6 characters." })
    }

    else
        return res.send({ error: true, message: "Please enter an email and a password." })
}

exports.signInValidator = (req, res, next) => {

    if (req.body.email && req.body.password)
        next()

    else
        return res.send({ message: "Please enter an email and a password." })
}