module.exports = (app) => {
  const sales = require("../controllers/sales.controllers");
  var router = require("express").Router();
  router.get("/", sales.findAll);
  router.get("/:customerId", sales.generateOrderSummary);
  router.put("/:product", sales.fromShelfToSales);
  router.delete("/", sales.deleteAllSales);

  app.use("/api/sales", router);
};
