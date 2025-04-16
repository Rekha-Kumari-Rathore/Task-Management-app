const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGN UP API (Sign In)
router.post("/sign-in", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate if username length is sufficient
    if (username.length < 4) {
      return res.status(400).json({ message: "Username should have at least 4 characters" });
    }

    // Validate email format (basic regex validation)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if username or email already exists using $or operator
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
    });

    // Save the new user to the database
    await newUser.save();
    return res.status(200).json({ message: "Sign-in successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN API (Log In)
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const existingUser = await User.findOne({ username: username });
    
    if (!existingUser) {
      console.error(`Login failed for username: ${username}. User not found.`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare entered password with stored password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    
    if (!existingUser) {
      console.error(`Incorrect password attempt for username: ${username}`);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // If password matches, create a JWT token with an expiration time of 1 day
    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
   
    return res.status(200).json({
      id: existingUser._id,
      user: existingUser,
      token: token
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
