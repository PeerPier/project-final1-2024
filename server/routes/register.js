const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const User = require("../models/user");
require("dotenv").config();

router.post("/", async (req, res) => {
  const {
    username,
    email,
    password,
    firstname,
    lastname,
    date_of_birth,
    gender,
    tel,
  } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already taken" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      firstname,
      lastname,
      date_of_birth,
      gender,
      tel,
    });
    await newUser.save();

    // Successful registration
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
