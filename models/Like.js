const mongoose = require("mongoose")

const likeModel = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    post_id: {
        type: String,
        require: true
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

module.exports = mongoose.model("likes", likeModel)