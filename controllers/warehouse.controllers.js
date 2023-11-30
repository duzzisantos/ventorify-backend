const WareHouseSchema = require("../models/warehouse");

//POST REQUEST HANDLER

exports.create = async (req, res) => {
  if (!req.body.product) {
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const wareHouse = new WareHouseSchema({
    officerName: req.body.officerName,
    category: req.body.category,
    product: req.body.product,
    batchNumber: req.body.batchNumber,
    batchAmount: req.body.batchAmount,
    price: req.body.price,
    economicOQ: req.body.economicOQ,
    productImage: req.body.productImage,
    firstEntryDate: req.body.entryDate,
  });

  wareHouse
    .save(wareHouse)
    .then((data) => {
      res.json(data);
      console.log("Inventory entry successful");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//GET REQUEST HANDLER

exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};

  WareHouseSchema.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

//GET REQUEST BY ID HANDLER

exports.findOne = (req, res) => {
  const id = req.params.id;
  WareHouseSchema.findById(id).then((data) => {
    !data
      ? res.status(404).json({
          message: "Resource not found.",
        })
      : res.status(200);
  });
};

//PUT REQUEST HANDLER
exports.update = (req, res) => {
  const id = req.params.id;
  WareHouseSchema.findOneAndUpdate(
    id,
    { $set: ("isInShelf", true) },
    (err, data, next) => {
      if (err) {
        console.log(err.message);
        return next(err);
      } else {
        res.status(200).json(data);

        console.log(
          "Successfully transferred inventory from warehouse to shelf."
        );
      }
    }
  );
};

//Updates inventory status from warehoused to shelved
exports.fromWarehouseToShelf = async (req, res) => {
  const id = req.params.id;
  WareHouseSchema.findOneAndUpdate(id, { $set: req.body }, (err, data) => {
    err ? console.log(err.message) : res.status(200).json(data);
  });
};

//Updates inventory status from shelved to sold
exports.fromShelfToSales = async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);
  WareHouseSchema.findOneAndUpdate(id, { $set: req.body }, (err, data) => {
    if (err) {
      res.status(500).send("Error retrieving document");
      return err;
    } else {
      res.status(200).json(data);
    }
  });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;
  WareHouseSchema.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(403).json({
          message: "Forbidden request!",
        });
      } else {
        res.status(200);
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.deleteAll = (req, res) => {
  WareHouseSchema.deleteMany({})
    .then((data) => {
      res.status(200).json({
        message: "Successfully deleted collection",
      });
      console.log(data, "All these data have been wiped from the collection");
    })
    .catch((err) => {
      console.log(err);
    });
};
