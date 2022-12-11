// Create Express server and router objects
const express = require("express")
const registrationRouter = express.Router()

// Import User registration service
const registerUser = require("../../services/user-registration")

// Import validation modules
const { userValidation } = require("../../validations/validation")


// : User Registration Route
registrationRouter.post("/", async (req, res) => {
    const userPayload = req.body
    // 1. Validate supplied data
    const { error } = userValidation(userPayload)
    if (error) {
        return res.status(400).send({ message: error })
    }
    
    // 2. If valid payload, process user registration 
    return registerUser(userPayload, res)
})

module.exports = registrationRouter