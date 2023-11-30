const goods = require("../controllers/aggregate-goods");

module.exports = (app) => {
  const express = require("express");
  var router = express.Router();

  router.get("/", goods.aggregateProducts);
  router.post("/:id", goods.transferAggregateGoodsToShelf);
  router.delete("/", goods.deleteAggregatedGoods);
  app.use("/api/aggregate-goods", router);
};
