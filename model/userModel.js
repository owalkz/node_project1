const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FreelancerDataSchema = new mongoose.Schema(
  {
    rate: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
  },
  { _id: false }
); // _id: false to prevent creation of a separate _id for this subdocument

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
  user_data: {
    type: Object,
    required: true,
  },
  freelancer_data: {
    type: FreelancerDataSchema,
    required: false, // Make it optional if it might not always be present
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpiresIn: {
    type: Date,
    required: false,
  },
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
