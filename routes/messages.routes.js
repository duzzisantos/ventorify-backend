module.exports = (app) => {
  const message = require("../controllers/messages.controllers");
  var express = require("express");
  var router = express.Router();

  router.post("/", message.create);
  router.get("/", message.findAll);
  router.get("/:id", message.findOne);
  router.put("/:id", message.update);
  router.delete("/:id", message.deleteOne);
  app.use("/api/messages", router);
};
