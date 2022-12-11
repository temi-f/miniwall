// Import bcryptjs to implement password security functionality
const bcrypt = require("bcryptjs")

// Import the User object for database interaction
const User = require("../models/User")


const registerUser = async (userPayload, res) => {
    // 1. If user already exists return error message
    const userExists = await User.findOne({ email: userPayload.email })
    if (userExists) {
        return res.status(400).send({ message: "User already exists!" })
    }

    // 2. Encrypt user supplied password with salt of reasonable length 
    // to increase complexity of possible reverse engineering effort
    const salt = await bcrypt.genSalt(15)
    const hashedPassword = await bcrypt.hash(userPayload.password, salt)
    
    // 3. create a new instance of User
    const user = new User({
        user_name: userPayload.user_name,
        email: userPayload.email,
        password: hashedPassword
    })
    // 4. Insert data into database
    try {
        const savedUser = await user.save()
        return res.send(savedUser)
    } catch (error) {
        return res.status(400).send({ message: error })
    }
}

module.exports = registerUser
