const Mongoose = require("mongoose");

const adminSchema = Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Admin", adminSchema);
