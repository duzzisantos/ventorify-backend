const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Messages = new Schema(
  {
    recipient: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    subject: String,
    messageBody: String,
    sent: {
      type: Boolean,
      default: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    reply: {
      replyBody: String,
      received: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", Messages);
