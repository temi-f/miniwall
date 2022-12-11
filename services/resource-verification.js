/* This module verifies Resource Identifiers 
 * supplied in request payload 
*/
const userModel = require("../models/User") // Import User schema object
const postModel = require("../models/Post") // Import Post schema object
const commentModel = require("../models/Comment") // Import Comment schema object
const likeModel = require("../models/Like") // Import Like schema object

const verifyUserAndPost = async (user_id, post_id, res) => {
    const errorMessages = []
    // Check that user_id exists on the platform 
    const userExists = await userModel.findOne({ _id: user_id })
    if (!userExists) errorMessages.push({ error_message: `User with ID: ${user_id} doesn't exist on the platform!` })

    // Check that post_id exists on the platform 
    const postExists = await postModel.findOne({ _id: post_id })
    if (!postExists) errorMessages.push({ error_message: `Post with ID: ${post_id} doesn't exist on the platform!` })

    return errorMessages
}

const verifyUserPostComment = async (user_id, post_id, comment_id, res) => {
    const errorMessages = []
    // Check that user_id exists on the platform 
    const userExists = await userModel.findOne({ _id: user_id })
    if (!userExists) errorMessages.push({ error_message: `User with ID: ${user_id} doesn't exist on the platform!` })

    // Check that post_id exists on the platform 
    const postExists = await postModel.findOne({ _id: post_id })
    if (!postExists) errorMessages.push({ error_message: `Post with ID: ${post_id} doesn't exist on the platform!` })

    // Check that comment_id exists on the platform 
    const commentExists = await commentModel.findById(comment_id)
    if (!commentExists) errorMessages.push({ error_message: `Comment with ID: ${comment_id} doesn't exist on the platform!` })

    return errorMessages
}

const verifyUser = async (user_id, res) => {
    const errorMessages = []
    // Check that user_id exists on the platform 
    const userExists = await userModel.findById(user_id)
    if (!userExists) errorMessages.push({ error_message: `User with ID: ${user_id} doesn't exist on the platform!` })
    return errorMessages
}

const verifyPost = async (post_id, res) => {
    const errorMessages = []
    // Check that user_id exists on the platform 
    const postExists = await postModel.findById(post_id)
    if (!postExists) errorMessages.push({ error_message: `Post with ID: ${post_id} doesn't exist on the platform!` })
    return errorMessages
}

const verifyComment = async (comment_id, res) => {
    const errorMessages = []
    // Check that user_id exists on the platform 
    const commentExists = await commentModel.findById(comment_id)
    if (!commentExists) errorMessages.push({ error_message: `Comment with ID: ${comment_id} doesn't exist on the platform!` })
    return errorMessages
}

const verifyLike = async (like_id, res) => {
    const errorMessages = []
    // Check that like_id exists on the platform 
    const likeExists = await likeModel.findById(like_id)
    if (!likeExists) errorMessages.push({ error_message: `Like with ID: ${like_id} doesn't exist on the platform!` })
    return errorMessages
}

module.exports.verifyUserAndPost = verifyUserAndPost
module.exports.verifyUser = verifyUser
module.exports.verifyPost = verifyPost
module.exports.verifyComment = verifyComment
module.exports.verifyLike = verifyLike
module.exports.verifyUserPostComment = verifyUserPostComment