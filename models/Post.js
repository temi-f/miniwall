const mongoose = require("mongoose")

const postModel = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        required: true,
        min: 6,
        max: 50
    },
    article: {
        type: String,
        require: true,
        min: 20,
        max: 1000 
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

module.exports = mongoose.model("posts", postModel)