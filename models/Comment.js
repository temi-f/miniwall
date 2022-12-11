const mongoose = require("mongoose")

const commentModel = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    post_id: {
        type: String,
        require: true
    },
    comment_text: {
        type: String,
        require: true,
        min: 20,
        max: 500 
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

module.exports = mongoose.model("comments", commentModel)