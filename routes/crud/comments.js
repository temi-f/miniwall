// Create Express server and router objects
const express = require('express')
const commentsRouter = express.Router()

const commentModel = require("../../models/Comment") // Import Comment schema object
const authAccess = require("../../services/auth-verification") // Import Request token authenticator
const { commentValidation, idFieldValidation } = require("../../validations/validation") // Import comment validator
const { isUserPostCurator, isUserCommentWriter } = require("../../services/user-authorisation") // Import utility functions to authorise user
const { 
    verifyUserAndPost, verifyUserPostComment, verifyPost, verifyComment
} = require("../../services/resource-verification") // Import utility functions to validate URI in payload

// -- Comments routes --
// :Return all Comments
commentsRouter.get('/', authAccess, async (req, res) => {
    try {
        const allComments = await commentModel.find({});
        res.send(allComments)
    } catch (error) {
        res.send({ message: error })
    }
})

// :Get comment by CommentID
commentsRouter.get('/:commentId', authAccess, async (req, res) => {
    let comment_id = req.params.commentId
    // 1. Validate supplied comment_id
    const { error } = idFieldValidation(comment_id)
    if (error) {
        return res.status(400).send({ message: error })
    }
    // 2. Check that comment_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyComment(comment_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. If valid ID process request
    try {
        let foundComments = await commentModel.findById(comment_id)
        res.send(foundComments)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

// :Return Comments belonging to specific Post ID
commentsRouter.get('/post/:postId', authAccess, async (req, res) => {
    let post_id = req.params.postId
    // 1. Validate supplied postId
    const { error } = idFieldValidation(post_id)
    if (error) {
        return res.status(400).send({ message: error })
    }
    // 2. Check that post_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyPost(post_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)
    
    // 3. If valid ID process request
    try {
        let foundComments = await commentModel.find({post_id: post_id})
        res.send(foundComments)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

// :Add a new comment for a post
commentsRouter.post('/', authAccess, async (req, res) => {
    let commentPayload = req.body
    // 1. Validate supplied data
    const { error } = commentValidation(commentPayload)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. Check that user_id and post_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyUserAndPost(commentPayload.user_id, commentPayload.post_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. Check if the post commenter also wrote the post. If so, decline access
    if (await isUserPostCurator(commentPayload.user_id, commentPayload.post_id)) {
        return res.status(401).send({ error_message: `User is not allowed to comment on their own Post!` })
    }

    // 4. Create a new instance of Comment
    const commentData = new commentModel({
        user_id: commentPayload.user_id,
        post_id: commentPayload.post_id,
        comment_text: commentPayload.comment_text
    })

    // 5. Insert data into database
    try {
        const savedComment = await commentData.save()
        res.send(savedComment)
    } catch (error) {
        res.send({ message: error })
    }
})


// :Edit a comment made on a post
commentsRouter.patch('/:commentId', authAccess, async (req, res) => {
    let commentPayload = req.body
    // 1. Validate supplied data
    let payloadErrors = []
    const { idError } = idFieldValidation(req.params.postId)
    console.log(idError)
    if (idError) payloadErrors.push(idError)
    const { otherPayloadError } = commentValidation(commentPayload)
    if (otherPayloadError) payloadErrors.push(otherPayloadError)
    if(payloadErrors.length > 0) return res.status(400).send({ message: payloadErrors })
    
    // 2. Check that user_id, post_id and comment_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyUserPostComment(
                                commentPayload.user_id, 
                                commentPayload.post_id, 
                                req.params.commentId
                            )
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. Check if user making the update, wrote the comment. 
    //    Otherwise, decline access
    let isCurator = await isUserCommentWriter(commentPayload.user_id, req.params.commentId)
    if (!isCurator) {
        return res.status(401).send({ error_message: "Only the user who wrote a Post can update their Post!" })
    }
    // 3. Update comment with payload data
    try {
        const patchedData = await commentModel.updateOne(
            { _id: req.params.commentId },
            {
                $set: {
                    user_id: commentPayload.user_id,
                    post_id: commentPayload.post_id,
                    comment_text: commentPayload.comment_text,
                    updated_at: Date.now()
                }
            }
        )
        res.send(patchedData)
    } catch (error) {
        res.send({ message: error })
    }
})

// :Delete a specific comment made on a post
commentsRouter.delete('/:commentId', authAccess, async (req, res) => {
    let comment_id = req.params.commentId
    // 1. Validate supplied data
    const { error } = idFieldValidation(comment_id)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. Check that comment_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyComment(comment_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. If valid ID process request
    try {
        const deletedComment = await commentModel.deleteOne({ _id: comment_id })
        res.send(deletedComment)
    } catch (error) {
        res.send({ message: error })
    }
})

module.exports = commentsRouter