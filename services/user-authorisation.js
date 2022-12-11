const postModel = require("../models/Post") // Import Post schema object
const commentModel = require("../models/Comment") // Import Comment schema object

const isUserPostCurator = async (user_id, post_id, res) => {
    const targetPost = await postModel.findOne({ _id: post_id })
    
    return targetPost.user_id == user_id
}

const isUserCommentWriter = async (user_id, comment_id, res) => {
    const targetComment = await commentModel.findById(comment_id)
    
    return targetComment.user_id == user_id
}

module.exports.isUserPostCurator = isUserPostCurator
module.exports.isUserCommentWriter = isUserCommentWriter