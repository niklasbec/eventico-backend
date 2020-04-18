const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv/config")


app.use(express.json());

//Import routes
const postsRouter = require("./routers/posts")
const authRouter = require("./routers/auth")
const eventRouter = require("./routers/events")

//Middlewares
app.use("/api/posts", postsRouter) //router middleware
app.use("/api/user", authRouter)
app.use("/api/events", eventRouter)


//connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log("Connected to DB"))

//starts the server
app.listen(3000, () => console.log("Server is running!"));