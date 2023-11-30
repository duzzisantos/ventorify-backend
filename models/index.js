const mongoose = require("mongoose");
const dbConfig = require("../config/connect");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("../models/users");
db.warehouse = require("../models/warehouse");
db.sales = require("../models/sales");
db.messages = require("../models/messages");
db.purchaseRequest = require("../models/purchase-request");
db.team = require("../models/team");
db.backupWarehouse = require("../models/backup-warehouse");
db.orders = require("../models/send-order-confirmation");
db.aggregateProducts = require("../models/aggregate-model");
db.prices = require("../models/price-list");
module.exports = db;
