module.exports = (app) => {
  const team = require("../controllers/team.controllers");
  var router = require("express").Router();
  router.get("/", team.findAll);
  app.use("/api/team", router);
};
