module.exports = (app) => {
  const purchase = require("../controllers/purchase-request.controllers");
  var router = require("express").Router();
  router.get("/:id", purchase.find);
  router.get("/", purchase.findAll);
  app.use("/api/reorder", router);
};
