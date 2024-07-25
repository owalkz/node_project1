const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const Message = require("../model/messageModel");
const sendEmail = require("../utils/sendEmail");

// Description: This function updates a freelancer's profile
// Route: PUT /api/freelancer/update
// Access: Private
const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const {
      rate = "",
      bio = "",
      phone_number = "",
      specialization = "",
      location = "",
      jobType = "",
      experience = "",
      completedProjects = "",
      linkedinUrl = "",
      githubUrl = "",
    } = req.body;

    if (rate) user.rate = rate;
    if (bio) user.bio = bio;
    if (phone_number) user.phone_number = phone_number;
    if (specialization) user.specialization = specialization;
    if (location) user.location = location;
    if (jobType) user.jobType = jobType;
    if (experience) user.experience = experience;
    if (completedProjects) user.completedProjects = completedProjects;
    if (linkedinUrl) user.linkedinUrl = linkedinUrl;
    if (githubUrl) user.githubUrl = githubUrl;
    const saveDetails = await user.save();

    if (!saveDetails) {
      return res
        .status(400)
        .json({ message: "Failed to update freelancer profile!" });
    }

    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "Freelancer profile updated successfully",
      userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
});

// Description: This function allows a user who is logged in to delete their account
// Route: POST api/freelancer/delete
// Access: Private
const deleteAccount = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }
  const email = user.email;
  // Assuming user.matchPassword(password) is a method that returns true if the passwords match
  try {
    const templateString = fs.readFileSync("./utils/mail/goodbye.html", "utf8");
    const emailContent = templateString.replace("${name}", user.first_name);
    const emailSent = await sendEmail(
      email,
      "Goodbye from GigIt",
      emailContent
    );
    await User.deleteOne({ _id: user._id });
    if (!emailSent) {
      return res.status(400).json({ message: "Invalid email" });
    }
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting account" });
  }
});

// Description: This function fetches a freelancer's messages
// Route: GET /api/freelancer/viewmessages
// Access: Private
const viewMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ recipient_id: req.user._id });
  if (!messages) {
    return res.status(400).json({ message: "No messages found" });
  }
  res.status(200).json({
    message: "Messages fetched successfully",
    messages,
  });
});

module.exports = {
  updateProfile,
  viewMessages,
  deleteAccount,
};
