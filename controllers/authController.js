const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const fs = require("fs");

exports.register = async (req, res, next) => {
  const { email, password, first_name, last_name = {} } = req.body;
  if (!email || !password || !first_name || !last_name) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  try {
    const email_exists = await User.findOne({ email });
    if (email_exists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const templateString = fs.readFileSync("./utils/mail/welcome.html", "utf8");
    const emailContent = templateString
      .replace("${name}", first_name)
      .replace("${loginLink}", `${process.env.CLIENT_URL}/login`);

    const emailSent = await sendEmail(email, "Welcome to gigit", emailContent);
    if (!emailSent) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Could not create user with the given data" });
    }

    // Convert the user document to a plain object and remove the password field
    const { password: _, ...userWithoutPassword } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
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
    if (await user.matchPassword(password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Destructure user object to exclude the password
      const { password, ...userWithoutPassword } = user.toObject();

      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token: token,
      });
    } else {
      res
        .status(422)
        .json({ message: "Invalid credentials, please try again!" });
    }
  } catch (err) {
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
  res.status(200).json({ message: "Logout successful" });
};

// Description: This function sends an email with a password reset link to a user
// Route: POST /api/auth/forgot-password
// Access: Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
  const templateString = fs.readFileSync(
    "./utils/mail/resetPassword.html",
    "utf8"
  );
  const emailContent = templateString
    .replace("${name}", user.first_name)
    .replace("${resetLink}", resetURL);
  const emailSent = await sendEmail(
    email,
    "Password Reset Request",
    emailContent
  );
  if (!emailSent) {
    return res.status(400).json({ message: "Invalid email" });
  }
  return res.status(200).json({ message: "Email sent successfully" });
};

// Description: This function allows a user with a valid token to reset their password
// Route: POST /api/auth/reset-password/token
// Access: Public
exports.resetPassword = async (req, res, next) => {
  const resetToken = req.params.id;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Description: This function allows a user with a valid token to reset their password
// Route: POST /api/auth/reset-password/token
// Access: Public
exports.getUserProfile = async (req, res, next) => {
  const resetToken = req.params.id;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Access token is invalid" });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    res
      .status(200)
      .json({ message: "User profile found!", user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
