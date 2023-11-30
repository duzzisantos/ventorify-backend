const Message = require("../models/messages");
const nodeMailer = require("nodemailer");
const generateEmailBody = require("../utils/generateEmailBody");

//Create new message instance
exports.create = async (req, res) => {
  if (req.body === "") {
    console.error("Message must contain a body");
  }

  const message = new Message({
    recipient: req.body.recipient,
    sender: req.body.sender,
    sent: req.body.sent,
    seen: req.body.seen,
    subject: req.body.subject,
    messageBody: req.body.messageBody,
  });

  message
    .save(message)
    .then((data) => {
      data ? res.status(200) : res.status(500);
    })
    .catch((err) => {
      console.error(err);
    });

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

    const emailContent = generateEmailBody(
      req.body.subject,
      req.body.messageBody
    );

    let email = await emailTransporter.sendMail({
      from: "Ventorify Purchasing Team " + requesterEmail,
      to: mailRecipient ?? req.body.recipient,
      subject: req.body.subject,
      text: `Dear ${req.body.recipient ?? mailRecipient},`,
      html: emailContent,
    });

    console.log(`${email.messageId} has been sent.`);
  };

  handleEmailSend().catch(console.error);
};

//Get all messages which have a valid Object ID
exports.findAll = async (req, res) => {
  const user = req.query.id;
  var condition = user ? { $regex: new RegExp(user), $options: "gi" } : {};
  Message.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err.message);
    });
};

//Get a particular message resource based on its unique Object ID
exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        error: "Message with this ID not found.",
        cause: "Object ID does not exist or request has no body.",
      });
    } else {
      message.seen = true;
    }

    return res.json(message);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error.", cause: err.message });
  }
};

//Reply one message resource based on its unique Object ID

exports.update = (req, res) => {
  const id = req.params.id;
  Message.findByIdAndUpdate(id, { $set: req.body }, (err, data) => {
    if (err) {
      res.status(404).json({
        message: "Error in updating resource. Resource not found",
        cause: err.message,
      });
    } else if (data) {
      res.status(200).json({ message: "Resource successfully updated." });
    }
  });
};

exports.deleteOne = (req, res) => {
  const id = req.params.id;
  Message.findByIdAndRemove(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};
