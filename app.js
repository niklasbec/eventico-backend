const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("dotenv/config")


app.use(express.json());

//Import routes
const postsRouter = require("./routes/posts")


//Middlewares, function that executes when routes are being hit
app.use("/posts", postsRouter) //router middleware

//ROUTES
app.get("/", (req, res) => {
    res.send("We are on home")
})


//connect to db

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log("Connected to DB"))

//starts the server
app.listen(3000);