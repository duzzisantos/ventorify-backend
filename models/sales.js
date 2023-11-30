const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Sales = new Schema(
  {
    product: String,
    totalProductCount: Number,
    category: String,
    economicOrderQuantity: Number,
    unitPrice: Number,
    salesOperations: {
      quantitySold: Number,
      revenue: Number,
      customerId: String,
      customerName: String,
      customerAddress: String,
      customerPhone: String,
      currentInventorySize: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sales", Sales);
