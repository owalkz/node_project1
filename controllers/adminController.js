const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");

const adminRegister = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: "Admin already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    email,
    password: hashedPassword,
  });
  return res.status(201).json({
    message: "Admin created successfully",
    email: admin.email,
  });
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return res.status(200).json({
    message: "Admin logged in successfully",
    token,
  });
});

module.exports = {
  adminRegister,
  adminLogin,
};
