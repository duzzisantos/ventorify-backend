const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderConfirmation = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerOrderAsPDF: {
      type: String,
      required: true,
    },
    customerHasPaid: {
      type: Boolean,
      default: false,
    },
    revenue: Number,

    offerDiscount: {
      type: Boolean,
      default: false,
    },

    paymentSanctionedBy: {
      type: String,
    },
    paymentConfirmationId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order-confirmation", OrderConfirmation);
