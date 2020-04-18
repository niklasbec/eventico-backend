const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//import validation
const {registerValidation, loginValidation} = require("../validation/validation")

router.post("/register", async (req, res) => {

    //validation with joi
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if email is unique
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).send("Email already exists, please login or use a different email.")

    //Hashing Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({user: savedUser._id})
  } catch(err) {
    res.status(400).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {
    //validation with joi
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //Check if email is in system
    const user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Email doesn't exist!")

    //Password check
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send("Invalid password")

    //Create JWT
    const token = jwt.sign({_id: user.id, name: user.name, email: user.email /*Data we want to provide frontend with*/}, process.env.JWT_SECRET)
    res.header("jwt-token", token).send(token)


    res.send("Successfully logged in")

})


module.exports = router;


/*
delete user
patch email/name/password


Release canvas 2:

get all public events
*/
