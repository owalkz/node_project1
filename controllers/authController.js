const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  const { first_name, last_name } = user_data[0];
  mailOptions.to = email;
  mailOptions.text = `${first_name}, welcome to DevConnect. We're glad to have you on board!`;
  mailOptions.subject = `Welcome to DevConnect`;
  const emailSent = await sendEmail(transporter, mailOptions);
  if (!emailSent) {
    return res.status(400).json({ message: "Invalid email" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
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
    if (await user.matchPassword(password)) {
      const token = generateToken(user._id);
      const userObject = {
        email: user.email,
        _id: user._id,
        token,
      };
      res.status(200).json({ message: "Login successful", user: userObject });
    }
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
  res.status(200).json({ message: "Logout successful" });
};

// Description: This function generates a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
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
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiresIn = Date.now() + 3600000;
  await user.save();
  console.log(user);
  const resetURL = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
  mailOptions.text = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetURL}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`;
  mailOptions.subject = "Password Reset Request";
  mailOptions.to = email;
  const emailSent = await sendEmail(transporter, mailOptions);
  if (!emailSent) {
    throw new Error("Error sending email");
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
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const mailOptions = {
  from: {
    name: "DevConnect",
    address: process.env.APP_USER,
  },
};

const sendEmail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return 1;
    return;
  } catch (error) {
    return "";
  }
};
