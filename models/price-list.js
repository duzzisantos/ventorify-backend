const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriceList = new Schema({
  _id: { type: String, required: true },
  product: String,
  category: String,
  unitPrice: Number,
});

module.exports = mongoose.model("price-list", PriceList);
