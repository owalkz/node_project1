const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Description: This function registers a new user
// Route: POST /api/auth/register
// Access: Public
exports.register = async (req, res, next) => {
  const { email, password, user_data = {} } = req.body;
  if (!email || !password || !user_data) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  const email_exists = await User.findOne({ email });
  if (email_exists) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const { first_name, last_name } = user_data[0];
  const user = await User.create({
    email,
    password: hashedPassword,
    user_data: {
      first_name,
      last_name,
    },
  });
  return res.status(201).json({
    message: "User created successfully",
    first_name,
    last_name,
    email,
    id: user._id,
  });
};

// Description: This function logs in a user
// Route: POST /api/auth/login
// Access: Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(422)
        .json({ message: "Invalid credentials, please try again!" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const userObject = {
        email: user.email,
        _id: user._id,
      };
      const token = generateToken(user._id);
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
      res
        .status(200)
        .json({ message: "Login successful", user: userObject });
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Login not successful",
      error: err.message,
    });
  }
};

// Description: This function logs out a user
// Route: POST /api/auth/logout
// Access: Public
exports.logout = async (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout successful" });
};

// Description: This function generates a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
