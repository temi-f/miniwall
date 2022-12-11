// Create Express server and router objects
const express = require('express')
const postRouter = express.Router()
// Import Post schema object
const Post = require("../../models/Post") 
const User = require("../../models/User") 

const authAccess = require("../../services/auth-verification") // Import Request token authenticator
const { postValidation } = require("../../validations/validation")
const { verifyUser, verifyUserAndPost} = require("../../services/resource-verification")
const { isUserPostCurator } = require("../../services/user-authorisation")


// -- Post routes --
// :Get all Posts that exist
postRouter.get('/', authAccess, async (req,res) => {
    try{
        const allPosts = await Post.find({});
        res.send(allPosts)
    }catch(error){
        res.send({message:error})
    }
})

// :Return Post matching a specific post ID
postRouter.get('/:postId', authAccess, async (req, res) =>{
    try{
        let matchingPosts = await Post.findById(req.params.postId)
        res.send(matchingPosts)
    }catch(error){
        res.send({message:error})
    }
})

// :Create a new Post
postRouter.post('/', authAccess, async(req, res)=>{
    let postPayload = req.body
    // 1. Validate supplied data
    const { error } = postValidation(postPayload)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. Check if user_id exists on the platform otherwise otherwise return an error message
    let errorMessages = await verifyUser(postPayload.user_id)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 3. Create an instance of a post
    const postData = new Post({
        user_id: postPayload.user_id,
        title: postPayload.title,
        article: postPayload.article
    })

    // 4. Insert data into MongoDB
    try {
        const savedPost = await postData.save()
        res.send(savedPost)
    } catch (error) {
        res.send({message: error})
    }
})

// Update an existing post record
postRouter.patch('/:postId', authAccess, async (req,res)=>{
    let postPayload = req.body

    // 1. Check that user_id and post_id exist on the platform,
    //    otherwise return an error message
    let errorMessages = await verifyUserAndPost(postPayload.user_id, req.params.postId)
    if (errorMessages.length > 0) return res.status(400).send(errorMessages)

    // 2. Check if user making the update, also wrote the post. 
    //    Otherwise, decline access
    let isCurator = await isUserPostCurator(postPayload.user_id, req.params.postId)
    if (!isCurator) {
        return res.status(401).send({ error_message: "Only the user who wrote a Post can update their Post!" })
    }
    // 3. Update post data with payload
    try {
        const patchedData = await Post.updateOne(
            {_id: req.params.postId},
            { $set: {
                user_id: postPayload.user_id,
                title: postPayload.title,
                article: postPayload.article,
                updated_at: Date.now()
                }
            }
        )
        res.send(patchedData)
    } catch (error) {
      res.send({message:error})  
    }
})

// Delete post matching a specific Post ID
postRouter.delete('/:postId', authAccess, async (req, res)=>{
    try {
        const deletedPost = await Post.deleteOne({_id: req.params.postId})
        res.send(deletedPost)
    } catch (error) {
      res.send({message:error})  
    }
})


module.exports = postRouter

