module.exports = (app) => {
  const sales = require("../controllers/generateOrders");
  var router = require("express").Router();
  router.get("/:customerId", sales.dispatchOrderSummary);
  app.use("/api/generate-order", router);
};
