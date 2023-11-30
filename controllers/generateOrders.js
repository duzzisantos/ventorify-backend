const SalesSchema = require("../models/sales");
const PDFDoc = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");

exports.dispatchOrderSummary = async (req, res) => {
  const { customerId } = req.body;

  if (customerId) {
    await SalesSchema.find({ customerId })
      .then((data) => {
        if (data.length === 0) {
          return res.status(404).json({ error: "Customer not found" });
        }
        const doc = new PDFDoc();

        const stream = fs.createWriteStream("orders.pdf");
        doc.pipe(stream);

        data.forEach((item) => {
          doc
            .fontSize(16)
            .text(item.product, { underline: true })
            .fontSize(12)
            .text(item.category)
            .fontSize(12)
            .text(item.salesOperations.quantitySold)
            .moveDown();
        });

        const pdfBuffer = [];
        doc.on("data", (chunk) => pdfBuffer.push(chunk));
        doc.end();

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

        const mailRecipient =
          process.env.GMAIL_USERNAME && process.env.GMAIL_RECIPIENT;

        emailTransporter.sendMail(
          {
            from: "Ventorify Purchasing Team " + requesterEmail,
            to: mailRecipient ?? req.body.recipient,
            subject: req.body.subject,
            text: `Dear ${req.body.recipient ?? mailRecipient},`,
            attachments: [
              {
                filename: `orders.pdf`,
                content: Buffer.concat(pdfBuffer),
              },
            ],
          },
          (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
      })

      .catch((err) => {
        console.log(err.message);
      });
  } else {
    res.status(400).json({ error: "Bad Request: customerId is required" });
  }
};
