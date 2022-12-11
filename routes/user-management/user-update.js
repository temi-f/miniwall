// Create Express server and router objects
const express = require('express')
const userRouter = express.Router()
const bcrypt = require("bcryptjs")

const User = require("../../models/User") // Import User schema object
const authAccess = require("../../services/auth-verification") // Import Request token authenticator
const { userValidation } = require("../../validations/validation")


// :Update an existing user record
userRouter.patch('/:userId', authAccess, async (req,res)=>{
    let userPayload = req.body
    // 1. Validate supplied data
    const { error } = userValidation(userPayload)
    if (error) {
        return res.status(400).send({ message: error })
    }

    // 2. If user doesn't exist return an error message
    const userExists = await User.findOne({ email: userPayload.email })
    if (!userExists) {
        return res.status(400).send({ message: `User with Email: ${userPayload.email} doesn't exist on our platform!` })
    }

    // 3. Encrypt user supplied password with salt of reasonable length 
    // to increase complexity of possible reverse engineering effort
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(userPayload.password, salt)

    try {
        const patchedData = await User.updateOne(
            {_id: req.params.userId},
            { $set: {
                user_name: userPayload.user_name,
                email: userPayload.email,
                password: hashedPassword,
                updated_at: Date.now()
                }
            }
        )
        return res.send(patchedData)
    } catch (error) {
      return res.send({message:error})  
    }
})

// :Delete a User record matching a specific User ID
userRouter.delete('/:userId', async (req, res)=>{
    try {
        const deletedUser = await Post.deleteOne({_id: req.params.userId})
        res.send(deletedUser)
    } catch (error) {
      res.send({message:error})  
    }
})

module.exports = userRouter