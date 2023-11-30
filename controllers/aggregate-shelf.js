const AggregateShelfItems = require("../models/aggregate-shelf-model");

//Get all shelf items
exports.aggregateShelfItems = async (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};
  AggregateShelfItems.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

//Delete one aggregated shelf item by ID
exports.deleteAggregatedProductById = (req, res) => {
  const id = req.params.id;
  AggregateShelfItems.findByIdAndRemove(id)
    .then((data) => {
      res.status(200);
      console.log(`${data?.product} with ${data?._id} was deleted`);
    })
    .catch((err) => {
      console.error(err.message);
    });
};

//Delete all aaggregated shelf item
exports.deleteAll = (req, res) => {
  AggregateShelfItems.deleteMany({})
    .then(() => {
      res.status(200).json({ message: "Deleted aggregated shelf items" });
    })
    .catch(() => {
      res.status(404).json({ message: "Not resources found" });
    });
};
