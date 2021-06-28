const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({

    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS
    }
})

transporter.verify((error, success) => {

  if (error) 
    console.log(error)

  else 
    console.log("Nodemailer is ready to receive emails")
})

module.exports = transporter