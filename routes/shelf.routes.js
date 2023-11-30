module.exports = (app) => {
  const shelf = require("../controllers/shelf.controllers");
  var express = require("express");
  var router = express.Router();
  router.get("/", shelf.findAll);
  router.delete("/", shelf.deleteAll);
  router.post("/:id", shelf.transferItem);
  app.use("/api/shelf", router);
};
