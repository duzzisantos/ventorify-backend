const Price = require("../models/price-list");

//Create new instances of product prices
exports.createPriceList = async (req, res) => {
  if (!req.body.product) {
    res.send({ message: "Body cannot be empty" });
    return;
  }

  const priceList = new Price({
    product: req.body.product,
    category: req.body.category,
    unitPrice: req.body.unitPrice,
  });

  priceList
    .save(priceList)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

//Get all prices in a price list
exports.getAllPrices = (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};

  Price.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

//Get one specific price based on price ID
exports.getSinglePriceById = (req, res) => {
  const id = req.params.id;
  Price.findById(id).then((data) => {
    !data
      ? res.status(404).json({ message: "Price was not found!" })
      : res.status(200);
  });
};

//Update a single price instance by ID
exports.updateSinglePrice = (req, res) => {
  const id = req.params.id;
  Price.findByIdAndUpdate(id, { $set: req.body }, (err, data, next) => {
    if (err) {
      res.status(400);
      return next(err);
    } else {
      res.status(200).json(data);
    }
  });
};

//Delete a single price by ID from the pricelist
exports.deleteSinglePrice = (req, res) => {
  const id = req.params.id;
  Price.findByIdAndRemove(id)
    .then((data) => {
      res.status(200);
      console.log(`${data?.product}'s price has been deleted`);
    })
    .catch((err) => {
      console.error(err.message);
    });
};
