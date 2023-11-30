const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseRequest = new Schema(
  {
    product: String,
    totalProductCount: Number,
    category: String,
    economicOrderQuantity: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("purchase-request", PurchaseRequest);
