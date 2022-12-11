// Create Express server and router objects
const express = require('express')
const likesRouter = express.Router()

const LikeModel = require("../../models/Like") // Import Like schema object
const authAccess = require("../../services/auth-verification") // Import Request token authenticator
const { likeValidation, idFieldValidation } = require("../../validations/validation") // Import validators
const { isUserPostCurator } = require("../../services/user-authorisation") // Import utility functions to authorise user
const { 
    verifyUserAndPost, verifyPost, verifyUser, verifyLike
} = require("../../services/resource-verification") // Import utility functions to validate URI in payload



// -- Like routes --
// :Get all Like records on the system
likesRouter.get('/', authAccess, async (req,res) => {
    try{
        const allLikes = await LikeModel.find({});
        res.send(allLikes)
    }catch(error){
        res.send({message:error})
    }
})

// :Get Likes by Like ID
likesRouter.get('/:likeId', authAccess, async (req, res) => {
    let like_id = req.params.likeId
    // 1. Validate supplied like_id
    const { error } = idFieldValidation(like_id)
    if (error) {
        return res.status(400).send({ message: error })
    }
    // 2. Check that like_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyLike(like_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. If valid ID process request
    try {
        let like = await LikeModel.findById(like_id)
        res.send(like)
    } catch (error) {
        res.status(500).send({ message: error })
    }
})

// :Get all Likes made on a specific Post
likesRouter.get('/post/:postId', authAccess, async (req, res) =>{
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

    // 3. If valid Post ID process request
    try{
        let foundLikes = await LikeModel.find({post_id: post_id})
        res.send(foundLikes)
    }catch(error){
        res.send({message:error})
    }
})

// :Get all Likes made by a specific User
likesRouter.get('/user/:userId', async (req, res) =>{
    let user_id = req.params.userId
    // 1. Validate supplied user_id
    const { error } = idFieldValidation(user_id)
    if (error) {
        return res.status(400).send({ message: error })
    }
    // 2. Check that user_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyUser(user_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. If valid User ID process request
    try{
        let foundLikes = await LikeModel.find({user_id: user_id})
        res.send(foundLikes)
    }catch(error){
        res.status(500).send({message:error})
    }
})

// :Create a new Like
likesRouter.post('/', authAccess, async(req, res)=>{
    let likePayload = req.body
    // 1. Validate supplied Like data
    const { error } = likeValidation(likePayload)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. Check that user_id and post_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyUserAndPost(likePayload.user_id, likePayload.post_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. Check if the user, also wrote the post. If so, decline access
    if (await isUserPostCurator(likePayload.user_id, likePayload.post_id)) {
        return res.status(401).send({ error_message: `User is not allowed to LIKE their own Post!` })
    }

    // 4. Create a new instance of Comment
    const likeData = new LikeModel({
        user_id: likePayload.user_id,
        post_id: likePayload.post_id
    })

    // 5. Insert into database
    try {
        const savedData = await likeData.save()
        res.send(savedData)
    } catch (error) {
        res.status(500).send({message: error})
    }
})

// Unlike a post that was previously liked
likesRouter.delete('/:likeId', authAccess, async (req, res)=>{
    let like_id = req.params.likeId
    // 1. Validate supplied like_id
    const { error } = idFieldValidation(like_id)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. Check that like_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyLike(like_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. If valid Like ID process request
    try {
        const deletedLike = await LikeModel.deleteOne({_id: like_id})
        res.send(deletedLike)
    } catch (error) {
      res.send({message:error})  
    }
})

module.exports = likesRouter
