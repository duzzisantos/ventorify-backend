module.exports = (app) => {
  const confirmation = require("../controllers/send-order-confirmation.controllers");
  var router = require("express").Router();
  router.post("/", confirmation.sendOrderConfirmation);
  router.get("/", confirmation.getOrderConfirmation);
  router.put("/:id", confirmation.updateCustomerPayment);
  app.use("/api/customer-order", router);
};
