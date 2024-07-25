const User = require("../model/userModel");
const Message = require("../model/messageModel");
const asyncHandler = require("express-async-handler");

// Description: This function gets all freelancers
// Route: GET /api/freelancers
// Access: Public
const getFreelancers = asyncHandler(async (req, res, next) => {
  try {
    const freelancers = await User.find();
    const cleaned_freelancers = freelancers.map((freelancer) => {
      // Remove the password field from the freelancer object
      delete freelancer.password;
      return {
        _id: freelancer._id,
        first_name: freelancer.first_name,
        last_name: freelancer.last_name,
        email: freelancer.email,
        rate: freelancer.rate,
        bio: freelancer.bio,
        phone_number: freelancer.phone_number,
        specialization: freelancer.specialization,
        location: freelancer.location,
        jobType: freelancer.jobType,
        verified: freelancer.verified,
        experience: freelancer.experience,
        completedProjects: freelancer.completedProjects,
        linkedinUrl: freelancer.linkedinUrl,
        githubUrl: freelancer.githubUrl,
        skills: freelancer.skills,
      };
    });
    return res.status(200).json(cleaned_freelancers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Description: This function sends a message to a freelancer
// Route: POST /api/freelancers/message
// Access: Public
const sendMessage = asyncHandler(async (req, res, next) => {
  const { message } = req.body;
  const recipient_id = req.params.id;
  if (!recipient_id || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newMessage = await Message.create({
    recipient_id,
    message,
  });
  if (!newMessage) {
    return res.status(500).json({ message: "Message not sent" });
  }
  return res.status(201).json({
    message: "Message sent successfully",
    newMessage,
  });
});

const getFreelancer = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Freelancer ID is required" });
  }
  const freelancer = await User.findById(id);
  if (!freelancer) {
    return res.status(404).json({ message: "Freelancer not found" });
  }
  return res.status(200).json({
    user_type: freelancer.user_type,
    _id: freelancer._id,
    first_name: freelancer.first_name,
    last_name: freelancer.last_name,
    email: freelancer.email,
    username: freelancer.username,
    rate: freelancer.rate,
    bio: freelancer.bio,
    phone_number: freelancer.phone_number,
    specialization: freelancer.specialization,
    location: freelancer.location,
    jobType: freelancer.jobType,
    verified: freelancer.verified,
    experience: freelancer.experience,
    completedProjects: freelancer.completedProjects,
    linkedinUrl: freelancer.linkedinUrl,
    githubUrl: freelancer.githubUrl,
    skills: freelancer.skills,
  });
});

const getSpecializations = asyncHandler(async (req, res, next) => {
  const freelancers = await User.find();
  const specializations = freelancers.map((freelancer) => {
    if (freelancer.specialization) {
      return freelancer.specialization;
    }
  });
  const unique_specializations = [...new Set(specializations.flat())];
  return res.status(200).json(unique_specializations);
});

const getCommonSpecialization = asyncHandler(async (req, res, next) => {
  const freelancers = await User.find();
  const specializations = freelancers.map((freelancer) => {
    if (freelancer.bio) {
      return freelancer.specialization;
    }
  });
  const specializationCounts = specializations.reduce((acc, specialization) => {
    acc[specialization] = (acc[specialization] || 0) + 1;
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(specializationCounts));
  const mostCommonSpecializations = Object.keys(specializationCounts).filter(
    (specialization) => specializationCounts[specialization] === maxCount
  );
  const matchingFreelancers = freelancers.filter((freelancer) => {
    if (freelancer.bio) {
      return mostCommonSpecializations.includes(freelancer.specialization);
    }
  });
  return res.status(200).json(matchingFreelancers);
});

module.exports = {
  getFreelancers,
  sendMessage,
  getFreelancer,
  getSpecializations,
  getCommonSpecialization,
};
