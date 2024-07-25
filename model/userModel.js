const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  phone_number: {
    type: String,
    required: false,
  },
  specialization: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  jobType: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: false,
  },
  experience: {
    type: Number,
    required: false,
  },
  completedProjects: {
    type: Number,
    required: false,
  },
  linkedinUrl: {
    type: String,
    required: false,
  },
  githubUrl: {
    type: String,
    required: false,
  },
  skills: [
    {
      name: {
        type: String,
        required: true,
      },
      level: {
        type: Number,
        required: true,
      },
    },
  ],
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
