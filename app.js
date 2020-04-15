const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv/config")


app.use(express.json());

//Import routes
const postsRouter = require("./routers/posts")
const authRouter = require("./routers/auth")

//Middlewares
app.use("/api/posts", postsRouter) //router middleware
app.use("/api/user", authRouter)

//ROUTES
app.get("/", (req, res) => {
    res.send("We are on home")
})


//connect to db

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log("Connected to DB"))

//starts the server
app.listen(3000, () => console.log("Server is running!"));