module.exports = (app) => {
  const price = require("../controllers/prices.controllers");
  var express = require("express");
  let router = express.Router();

  router.get("/", price.getAllPrices);
  router.get("/:id", price.getSinglePriceById);
  router.put("/:id", price.updateSinglePrice);
  router.post("/", price.createPriceList);
  router.delete("/:id", price.deleteSinglePrice);
  app.use("/api/price-list", router);
};
