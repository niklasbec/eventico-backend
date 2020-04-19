const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//import validation
const { registerValidation, loginValidation, patchUserValidation } = require("../validation/validation")
const verify = require("./verifyToken");

router.post("/register", async (req, res) => {

  //validation with joi
  const { error } = registerValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //Check if email is unique
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send("Email already exists, please login or use a different email.")

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
    res.send({ user: savedUser._id })
  } catch (err) {
    res.status(400).send(err);
  }
});

// Login
router.post("/login", async (req, res) => {

  //validation with joi
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  try {

    //Check if email is in system
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email doesn't exist!")

    //Password check
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invalid password")

    //Create JWT
    const token = jwt.sign({ _id: user.id, name: user.name, email: user.email /*Data we want to provide frontend with*/ }, process.env.JWT_SECRET)
    res.header("jwt-token", token).send(token)


    res.send("Successfully logged in")
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

})

// Patch User (email/name/password)
router.patch("/:id", verify, async (req, res) => {

  const { error } = patchUserValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const updatedUser = { name: req.body.name, email: req.body.email, passowrd: req.body.password }

  try {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) {
      res.status(404).json({ message: "Incorrect User ID" })
    } else {
      const updated = await User.updateOne({ _id: req.params.id }, { $set: { name: updatedUser.name, email: updatedUser.email, password: updatedUser.password } })
      res.status(201).json({ message: "Update successful" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// Delete

router.delete("/:id", verify, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    if (!user) {
      res.status(404).json({ message: "Incorrect User ID" })
    } else {
      const deleted = await User.deleteOne({ _id: req.params.id })
      res.status(202).json({ message: "User deleted successfully" })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})




module.exports = router;

/*
Release canvas 2:

get all public events
*/
