const mongoose = require("mongoose")

const userModel = mongoose.Schema({
    user_name: {
        type: String,
        require: true,
        min: 3,
        max: 256
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 256 
    },
    password: {
        type: String,
        require: true,
        min: 6,
        max: 1024
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model("users", userModel)