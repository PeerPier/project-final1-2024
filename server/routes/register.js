const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const User = require("../models/user");
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
          });

          newUser.save((err) => {
            if (err) {
              return done(err);
            }

            return done(null, newUser);
          });
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID_NEW,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_NEW,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
          });

          newUser.save((err) => {
            if (err) {
              return done(err);
            }

            return done(null, newUser);
          });
        }
      });
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Facebook authentication route
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook callback route
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to the homepage
    res.redirect("/");
  }
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to the homepage
    res.redirect("/");
  }
);

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
