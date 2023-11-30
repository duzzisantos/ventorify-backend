const WareHouseSchema = require("../models/warehouse");
const AggregateProducts = require("../models/aggregate-model");
const AggregateShelfItems = require("../models/aggregate-shelf-model");
// const PurchaseRequest = require("../models/purchase-request");

//AGGREGATE WAREHOUSE RESOURCES INTO UNIQUE PRODUCTS (for generating reports and tracking inventory size)
//This is akin to sorting and stowing in a physical warehouse
//Aggregate product data is fed from warehouse refined and grouped, and a bulk insert is done to the Aggregate goods collection

exports.aggregateProducts = async (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};
  try {
    const result = await WareHouseSchema.find(condition);
    const productNames = [...new Set(result.map((element) => element.product))];
    const groupedProducts = productNames.map((product) => {
      const filteredProducts = result
        .filter((item) => item.product === product)
        .map((list) => list);

      const totalProductCount = filteredProducts
        .map((productCount) => productCount.batchAmount)
        .reduce((prev, next) => prev + next, 0);

      const category = Array.from(
        new Set(filteredProducts.map((item) => item.category))
      ).join("");

      const eoq = Array.from(
        new Set(filteredProducts.map((item) => item.economicOQ))
      ).join("");

      const economicOrderQuantity = Number(eoq); //since they are constant - we return the average of all entries to avoid duplication

      const unitPrice = Number(
        Array.from(new Set(filteredProducts.map((item) => item.price))).join("")
      );

      return {
        product,
        totalProductCount,
        category,
        economicOrderQuantity,
        unitPrice,
      };
    });

    //Sends aggregated grouped products to the Aggregate goods collection to enable easier inventory tracking and decision-making
    async function bulkify() {
      try {
        const result = await AggregateProducts.insertMany(groupedProducts);
        res.send(result);
      } catch (err) {
        console.error(err.message);
      }
    }

    //call it back, otherwise, this action doesn't occur
    bulkify();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", cause: error.message });
  }
};

//COntroller to move identified aggregated goods to shelf - and thereafter delete the copy from its source to avoid accounting duplication
exports.transferAggregateGoodsToShelf = async (req, res) => {
  const itemID = req.params.id;
  try {
    const data = await AggregateProducts.findById(itemID);

    if (!data) {
      return res
        .status(404)
        .json({ message: "Aggregate goods not found in warehouse" });
    }

    //query this current data collection to see if it has a product property
    const productsWithSameName = await WareHouseSchema.find({
      product: data.product,
    });

    if (!productsWithSameName || productsWithSameName.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching products found in warehouse" });
    }

    //find total quantity in warehouse for products with the same name
    const totalQuantityInWareHouse = productsWithSameName.reduce(
      (total, product) => total + product.batchAmount,
      0
    );

    //transfer full quantity of aggregated product to shelf - meaning - there are no goods remaining in the warehouse for this category
    const toShelf = new AggregateShelfItems({
      product: data.product,
      totalProductCount: totalQuantityInWareHouse,
      category: data.category,
      economicOrderQuantity: data.economicOrderQuantity,
      unitPrice: data.unitPrice,
    });

    //first saves transferred items to shelf
    await toShelf.save();
    await WareHouseSchema.deleteMany({ product: data.product });
    //then removes that item we saved to shelf from the aggregated product list
    await AggregateProducts.findByIdAndRemove(itemID);

    return res
      .status(200)
      .json({ message: "Successfully transferred aggregated goods to shelf" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Reserve this for future expansion. You can only delete from the top level using the /warehouse endpoint
exports.deleteAggregatedGoods = async (req, res) => {
  try {
    const result = await AggregateProducts.deleteMany({});

    if (result.deletedCount === 0) {
      // No documents were deleted, which means the collection was already empty
      return res
        .status(404)
        .json({ message: "No aggregate products found to delete" });
    }

    return res.status(200).json({ message: "Successfully cleared warehouse" });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in deleting aggregate products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
