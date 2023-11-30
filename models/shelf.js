const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Shelf = new Schema(
  {
    officerName: String,
    category: String,
    product: String,
    batchNumber: Number,
    batchAmount: Number,
    economicOQ: Number,
    price: Number,
    productImage: String,
    firstEntryDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("shelf", Shelf);
