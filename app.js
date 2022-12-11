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
    res.send( 
        `<H3> MiniWall API</H3>
        <p>List of Publicly Accessible Routes</p>
        <br>- User Registration: <a href="/api/user/registration"><b>POST /api/user/registration</b></a>
        <br>
        <br>- User Authentication: <a href="/api/user/auth"><b>POST /api/user/auth</b></a>
        <br>
        <br>- Update User Details: <a href="/api/users/{userId}"><b>PATCH /api/users/{userId}</b></a>
        <br>- Delete User Details: <a href="/api/users/{userId}"><b>DELETE /api/users/{userId}</b></a>
        <br>
        <br>- New Post: <a href="/api/posts/"><b>POST /api/posts/</b></a>
        <br>- Get Post By ID: <a href="/api/posts/{postId}"><b>GET /api/posts/{postId}</b></a>
        <br>- Get All Posts: <a href="/api/posts/"><b>GET /api/posts/</b></a>
        <br>- Update Existing Post: <a href="/api/posts/{postId}"><b>PATCH /api/posts/{postId}</b></a>
        <br>- Delete Existing Post: <a href="/api/posts/{postId}"><b>DELETE /api/posts/{postId}</b></a>
        <br>
        <br>- Get Comments By ID: <a href="/api/comments/{commentId}"><b>GET /api/comments/{commentId}</b></a>
        <br>- Get Comments By Post ID: <a href="/api/comments/post/{postId}"><b>GET /api/comments/post/{postId}</b></a>
        <br>- Post a new Comment: <a href="/api/comments/"><b>POST /api/comments/</b></a>
        <br>- Update an Existing Comment: <a href="/api/comments/{commentId}"><b>PATCH /api/comments/{commentId}</b></a>
        <br>- Delete a Comment: <a href="/api/comments/{commentId}"><b>DELETE /api/comments/{commentId}</b></a>
        <br>
        <br>- Get All Likes: <a href="/api/likes/"><b>GET /api/likes/</b></a>
        <br>- Get Like By ID: <a href="/api/likes/{likeId}"><b>GET /api/likes/{likeId}</b></a>
        <br>- Get Likes By Post ID: <a href="/api/likes/post/{postId}"><b>GET /api/likes/post/{postId}</b></a>
        <br>- Get Likes By User ID: <a href="/api/likes/user/{userId}"><b>GET /api/likes/user/{userId}</b></a>
        <br>- Post a new like: <a href="/api/likes/"><b>POST /api/likes/</b></a>
        <br>- Delete a Like: <a href="/api/likes/{likeId}"><b>DELETE /api/likes/{likeId}</b></a>
        `
    )
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

