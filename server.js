require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const db = require("./models");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const xss = require("xss-clean");

const connectionParameters = {
  useNewURLParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
};

db.mongoose
  .connect(db.url, connectionParameters)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit();
  });

const corsOptions = {
  origin: `http://localhost:${process.env.REACT_APP_PORT}`,
  methods: "GET, POST, PUT, DELETE",
  crendentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

//Dependency utilization
app.use(
  session({
    secret: "floridaG22#",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.options("*", cors());

app.use(xss());
app.use(helmet());
app.use(
  mongoSanitize({
    replaceWith: "-",
  })
);

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", `http://localhost:${process.env.REACT_APP_PORT}/`],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      upgradeInsecureRequests: [],
      objectSrc: ["'none'"],
    },
  })
);

app.use(helmet.crossOriginEmbedderPolicy());
app.use(
  helmet.referrerPolicy({
    options: "no referrer",
  })
);

app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(
  helmet.hsts({
    maxAge: 15552000,
    preload: true,
    includeSubDomains: false,
  })
);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Application",
    description:
      "This application is an inventory management enterprise project",
  });
});

//Route for displaying session information

app.get("/api/session", (req, res) => {
  res.json(req.session);
});

//Route for setting cookie

let cookieName = `ventorify-user-${Object.freeze(Date.now())}`;
app.get("/api/cookie", (req, res) => {
  res.cookie(cookieName, "1", {
    maxAge: new Date(Date.now() + 900000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  console.log(req.cookies);
  res.send("This site uses cookies!");
});

//Route for displaying cookie

app.get("/api/display-cookie", (req, res) => {
  res.send(
    `<div>
      <h1>This website uses cookies</h1> 
      <h4>Click below to accept</h4> 
      <button id='cookie-btn'>Accept</button> 
      <button>Reject</button>
    </div>`
  );
});

//ROUTE FOR THE WAREHOUSE API ENDPOINT
require("./routes/warehouse.routes")(app);
require("./routes/team.routes")(app);

//ROUTE FOR MESSAGING API ENDPOINT
require("./routes/messages.routes")(app);

//ROUTE FOR PROFILES
// require("./routes/profile.routes")(app);

//ROUTE FOR SALES
require("./routes/sales.routes")(app);

//ROUTE FOR BACKING UP ORIGINAL WAREHOUSE DATA PER EVERY CHANGE IN THE DATASET
require("./routes/backupWarehouse.routes")(app);

//ROUTE FOR SHELVING
require("./routes/shelf.routes")(app);

//ROUTE FOR REORDER LOGIC
require("./routes/purchase-request.routes")(app);

//ROUTE FOR GETTING AGGREGATE GOODS
require("./routes/aggregate-goods")(app);

//ROUTE FOR GETTING PRICES
require("./routes/prices.routes")(app);

require("./routes/aggregate-shelf-route")(app);

require("./routes/generateOrders.routes")(app);

require("./routes/send-order-confirmation.routes")(app);

//Error handler
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Backend Error!");
  return next(err);
});

//Connection settings
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("LISTENING TO PORT: ", PORT);
});
