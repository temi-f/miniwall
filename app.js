// Creating an Express server app
const express = require("express")
const app = express()

app.use(express.json())

// Acquire DB Connection
const DB_CONNECTION = require('./services/db-connection')

// Check DB connection
DB_CONNECTION.on("error", console.error.bind(console, "connection error: "))
DB_CONNECTION.once("open", () => {
    console.log('Connection to MongoDB database is now open!')
})

// Middleware 
const postRoute = require("./routes/crud/posts")
const userRoute = require("./routes/user-management/user-update")
const likesRoute = require("./routes/crud/likes")
const commentsRoute = require("./routes/crud/comments")

const userRegistrationRoute = require("./routes/user-management/registration")
const userAuthenticationRoute = require("./routes/user-management/authentication")


// Wire up requests to appropriate endpoint
app.use("/api/posts", postRoute)
app.use("/api/users", userRoute)
app.use("/api/likes", likesRoute)
app.use("/api/comments", commentsRoute)
app.use("/api/user/registration", userRegistrationRoute)
app.use("/api/user/auth", userAuthenticationRoute)


// Create a default route
app.get('/', (req,res) => {
    res.send("This is the default endpoint")
})

//Listen for TCP connection on port 3000
var server = app.listen(3000, () => {
    try {
        console.log("Listening for TCP request on Port: 3000")
    } catch (error) {
        console.log(error)
    }
})

server.timeout = 100000;

