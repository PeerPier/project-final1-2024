const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token received:", token); // Log the received token

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded); // Log the decoded token data

    // Check if user exists in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log any verification errors
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

module.exports = auth;
