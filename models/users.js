const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordHint: {
      question: String,
      answer: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", Users);
