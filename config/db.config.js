const mongoose = require('mongoose')

const db = mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
})

mongoose.connection.on("connected", () => console.log("MongoDB database has been connected successfully"))
mongoose.connection.on("error", (err) => console.log(err))

module.exports = db