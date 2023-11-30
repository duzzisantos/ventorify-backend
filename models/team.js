const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Team = new Schema({
  name: String,
  lastName: String,
  role: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  email: String,
});

module.exports = mongoose.model("team", Team);
