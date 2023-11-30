const nodeMailer = require("nodemailer");
const AggregatedGoods = require("../models/aggregate-model");
const Purchase = require("../models/purchase-request");
const generateEmailContent = require("../utils/generateEmailContent");
//Always check Nodemailer package on npm to check for any updates or changes in implementation

exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $option: "gi" } : {};
  Purchase.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.find = async (req, res) => {
  const id = req.params.id;
  try {
    const aggregateGoods = await AggregatedGoods.findById(id);
    const reorder = {
      product: aggregateGoods.product,
      totalProductCount: aggregateGoods.totalProductCount,
      category: aggregateGoods.category,
      economicOrderQuantity: aggregateGoods.economicOrderQuantity,
      reorderQuantity:
        parseInt(aggregateGoods.economicOrderQuantity) -
        parseInt(aggregateGoods.totalProductCount), //we need to order the deficit number of wareHouseItems to reach EOQ
    };

    //Logic for sending purchase request email to vendor
    const handleEmailSend = async () => {
      //Email and password for the sender
      const requesterEmail = process.env.GMAIL_USERNAME;
      const requesterPassword = process.env.GMAIL_PASSWORD;
      const mailServerHost = process.env.HOST;
      //Email parameters
      const emailTransporter = nodeMailer.createTransport({
        auth: {
          user: requesterEmail,
          pass: requesterPassword,
        },
        host: mailServerHost,
        secure: false,
        port: 587,
        tls: {
          rejectUnauthorized: false,
        },
        debug: true,
      });

      //email recipient
      const mailRecipient =
        process.env.GMAIL_USERNAME && process.env.GMAIL_RECIPIENT;

      //Generate email content using HTML template and email reorder object values
      const emailContent = generateEmailContent(
        reorder.product,
        reorder.category,
        reorder.reorderQuantity
      );

      //Sends a product reorder request email to the vendor based on the options provided in the sendMail method
      let email = await emailTransporter.sendMail({
        from: "Ventorify Purchasing Team " + requesterEmail,
        to: mailRecipient,
        subject:
          "Purchase Request " + new Date(Date.now()).toLocaleDateString(),
        text: `We would like to make an order for ${reorder.reorderQuantity} units of ${reorder.product}`,
        html: emailContent,
      });

      console.log(`${email.messageId} has been sent.`);
    };

    handleEmailSend().catch(console.error);

    //Saves purchases data in Purchase collection
    await Purchase.insertMany(reorder);
  } catch (err) {
    console.log(err.message);
  }
};
