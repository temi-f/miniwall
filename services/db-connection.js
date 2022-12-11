const mongoose = require('mongoose')
require("dotenv/config")

// Initialise database URL
const DB_URI = `mongodb+srv://temi_dev:${process.env.KEY}@cluster0.ocahpze.mongodb.net/${process.env.DB_NAME}
?retryWrites=true&w=majority`

// Connection to MongoDB Database
mongoose.connect(DB_URI, () => {})

// Check DB connection
const db = mongoose.connection;

module.exports = db;