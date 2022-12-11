// Create Express server and router objects
const express = require("express")
const authRouter = express.Router()

// Import User registration service
const authenticateUser = require("../../services/user-authentication")

// Import validation modules
const { loginValidation } = require("../../validations/validation")


// Implement endpoint for `user login`
authRouter.post("/", async (req, res) => {
    const userPayload = req.body
    // 1. Validate supplied data
    const {error} = loginValidation(userPayload)
    if (error) {
        return res.status(400).send({message: error})
    }

    // 2. If payload is valid, authenticate user credentials
    return authenticateUser(userPayload, res)
})

module.exports = authRouter