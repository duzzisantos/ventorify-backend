require("dotenv").config();
process.env.NODE_ENV = "production";
const express = require("express");
const app = express();
const cors = require("cors");
const { jwtDecode } = require("jwt-decode");
const MongoStore = require("connect-mongo");
// const bodyParser = require("body-parser");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const methodOverride = require("method-override");
const db = require("../models");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const xss = require("xss-clean");

const localhost = process.env.REACT_APP_LOCAL;
const webhost = process.env.REACT_APP_WEBHOST;

//MongoDB connection parameters
const connectionParameters = {
  ssl: true,
  sslValidate: true,
};

//MongoDB connection
db.mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit();
  });

//Policy set for exchange in communication between client and server
//expanded cor options
var corsOptions = {
  origin: process.env.NODE_ENV === "development" ? localhost : webhost,
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Add required headers
  credentials: true, // If you need to include cookies in CORS requests
};

// Rate limiter for slowing down excessive cals to the server
const limiter = RateLimit({
  windowMs: 1 * 60 * 100,
  max: 30,
});

//Dependency utilities
app.use(
  session({
    secret: "nebraska",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 60000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, //14 days
    }),
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
      scriptSrc: ["'self'", `http://localhost:${localhost}/`],
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
require("../routes/warehouse.routes")(app);
require("../routes/team.routes")(app);

//ROUTE FOR MESSAGING API ENDPOINT
require("../routes/messages.routes")(app);

//ROUTE FOR PROFILES
// require("./routes/profile.routes")(app);

//ROUTE FOR SALES
require("../routes/sales.routes")(app);

//ROUTE FOR BACKING UP ORIGINAL WAREHOUSE DATA PER EVERY CHANGE IN THE DATASET
require("../routes/backupWarehouse.routes")(app);

//ROUTE FOR SHELVING
require("../routes/shelf.routes")(app);

//ROUTE FOR REORDER LOGIC
require("../routes/purchase-request.routes")(app);

//ROUTE FOR GETTING AGGREGATE GOODS
require("../routes/aggregate-goods")(app);

//ROUTE FOR GETTING PRICES
require("../routes/prices.routes")(app);

require("../routes/aggregate-shelf-route")(app);

require("../routes/generateOrders.routes")(app);

require("../routes/send-order-confirmation.routes")(app);

//Error handler
app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Backend Error!");
  return next(err);
});

//Middleware to verify request header authorization
app.use("/", (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized Access" });
  }

  const decodedToken = jwtDecode(token);

  if (decodedToken.aud === process.env.AUTHORIZATION_AUDIENCE) {
    req.decodedToken = decodedToken;
    next();
  } else {
    res.status(401).json({ message: "Unauthorized Access" });
  }
});

//Connection settings
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", (err) => {
  err ? console.log(err) : console.log("LISTENING TO PORT: ", PORT);
});
