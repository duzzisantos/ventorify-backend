module.exports = (app) => {
  const warehouse = require("../controllers/warehouse.controllers");
  var router = require("express").Router();

  router.post("/", warehouse.create);
  router.get("/:id", warehouse.findOne);
  router.get("/", warehouse.findAll);
  router.put("/:id", warehouse.fromWarehouseToShelf);
  router.put("/:id", warehouse.fromShelfToSales);
  router.delete("/:id", warehouse.deleteOne);
  router.delete("/", warehouse.deleteAll);
  app.use("/api/warehouse", router);
};

// @@ Documentation

// The post end point creates new resources in the Warehouse collection
// The get/:id endpoint gets items from the collection based on their object ID
// The general get / endpoint obtains all data in the collection
// The put/:id fromWarehouseToShelf changes the status of warehoused items to shelved items by updating the boolean values
// The put/:id fromShelfToSales changes the status of shelved items to sold items by updating the boolean values
// The delete:/id removes specific resources from the collection based on their object ID
// The general delete / endpoint with deletes resource. This is an expensive endpoint.
