const Orders = require("../models/send-order-confirmation");
const nodemailer = require("nodemailer");
const base64 = require("base64-js");

exports.sendOrderConfirmation = async (req, res) => {
  if (!req.body) {
    console.log("Request body cannot be empty");
  }

  //Sends one copy of the order to the database
  const confirmation = new Orders({
    customerId: req.body.customerId,
    customerName: req.body.customerName,
    customerOrderAsPDF: req.body.customerOrderAsPDF,
    revenue: req.body.revenue,
    offerDiscount: req.body.offerDiscount,
    paymentSanctionedBy: req.body.paymentSanctionedBy,
    paymentConfirmationId: req.body.paymentConfirmationId,
  });

  confirmation
    .save(confirmation)
    .then((data) => {
      data ? res.status(200) : res.status(500);
    })
    .catch((err) => {
      console.error(err);
    });

  //Sends another copy of the order information (with PDF) to customer email
  const pdfContent = req.body.customerOrderAsPDF;
  const pdfBuffer = Buffer.from(base64.toByteArray(pdfContent));

  const handleEmailSend = async () => {
    //Email and password for the sender
    const requesterEmail = process.env.GMAIL_USERNAME;
    const requesterPassword = process.env.GMAIL_PASSWORD;
    const mailServerHost = process.env.HOST;

    //Email parameters
    const emailTransporter = nodemailer.createTransport({
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

    let email = await emailTransporter.sendMail({
      from: "Ventorify Purchasing Team " + requesterEmail,
      to: mailRecipient,
      subject: `Thanks for placing order`,
      html: `<p>Dear ${req.body.customerName},</p> <p>Here attached, is your order. Please proceed to pay and we can
      complete the ordering process.</p> <p>Thank you. Your Ventorify Team.</p>`,
      attachments: [
        {
          filename: `${req.body.customerName}.pdf`,
          content: pdfBuffer,
          contentType: "pdf",
        },
      ],
    });

    console.log(`${email.messageId} has been sent.`);
  };

  handleEmailSend().catch(console.error);
};

exports.getOrderConfirmation = async (req, res) => {
  const id = req.query.id;
  var condition = id ? { $regex: new RegExp(id), $options: "gi" } : {};
  Orders.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.updateCustomerPayment = (req, res) => {
  const id = req.params.id;
  Orders.findByIdAndUpdate(id, { $set: req.body }, (err, data, next) => {
    if (err) {
      res.status(400);
      return next(err);
    } else {
      res.status(200).json(data);
    }
  });
};
