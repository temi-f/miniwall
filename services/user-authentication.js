// Import jsonwebtoken to implement authentication functionality
const bcrypt = require("bcryptjs")
const jsonwebtoken = require("jsonwebtoken")

// Import the User object for database interaction
const User = require("../models/User")

require("dotenv/config")


const authenticateUser = async (userPayload, res) => {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email: userPayload.email })
    if (!existingUser) {
        return res.status(400).send({ message: "User doesn't exist!" })
    }
    // 2. validate user password
    const validPassword = await bcrypt.compare(userPayload.password, existingUser.password)
    if (!validPassword) {
        return res.status(400).send({ message: "User details supplied could not be found!" })
    }

    // 3. Generate JWT
    const token = await jsonwebtoken.sign({ "_id": existingUser._id }, process.env.TOKEN_SECRET)
    return res.header('auth-token', token).send({ "auth-token": token })
}

module.exports = authenticateUser