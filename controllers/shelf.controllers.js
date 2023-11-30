const Shelf = require("../models/shelf");
const WareHouse = require("../models/warehouse");

//GET REQUEST HANDLER

exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};

  Shelf.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.transferItem = async (req, res) => {
  const itemID = req.params.id;
  try {
    const data = await WareHouse.findById(itemID);
    if (!data) {
      return res.status(404).json({ error: "Item not found" });
    }

    //Since we have queried this itemID to find its other properties, if it contains ohter request
    //bodies, we create a new instance of the Shelf Schema, and add those request bodies to it

    const toShelf = new Shelf({
      soldUnits: data.soldUnits,
      officerName: data.officerName,
      category: data.category,
      firstEntryDate: data.firstEntryDate,
      batchNumber: data.batchNumber,
      batchAmount: data.batchAmount,
      economicOQ: data.economicOQ,
      productImage: data.productImage,
      product: data.product,
      price: data.price,
    });

    //save new instance of shelf item coming from warehouse
    await toShelf.save();

    //remove transferred item from warehouse to avoid redundancy
    await WareHouse.findByIdAndRemove(itemID);

    return res
      .status(200)
      .json({ message: "Successful transfer from warehouse to shelf." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

exports.deleteAll = (req, res) => {
  Shelf.deleteMany({})
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
