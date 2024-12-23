// controllers/authController.js  
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Generate JWT  
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user  
// @route   POST /api/auth/register  
// @access  Public  
const registerUser = async (req, res) => {

  console.log(req.body)

  const { username, email, password } = req.body;


  // Validate input  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Check if email or username already exists  
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email or username',
      });
    }

    // Create user  
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user  
// @route   POST /api/auth/login  
// @access  Public  
const authUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body)

  // Validate input  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    // Find user by email  
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  authUser,
};  