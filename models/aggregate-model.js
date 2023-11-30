const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AggregateProducts = new Schema({
  product: String,
  totalProductCount: Number,
  category: String,
  economicOrderQuantity: Number,
  unitPrice: Number,
});

module.exports = mongoose.model("aggregate-products", AggregateProducts);
