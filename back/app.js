require("dotenv").config();

const express = require("express");
const Moralis = require("moralis").default;
const cors = require("cors");
const errorHandler = require("./src/middlewares/errorhandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const auth = require("./src/auth/authRouter");
const user = require("./src/user/controller");
const contracts = require("./src/contracts/controller");
const posts = require("./src/posts/controller");
const replies = require("./src/replies/controller");
const scrape = require("./src/blockchain/collections.js");
const port = "3001";

const app = express();
const router = express.Router();

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(function (req, res, next) {

  var allowedDomains = ['http://localhost:3000','https://app.nftq.org', 'https://nft-q.vercel.app/' ];
  var origin = req.headers.origin;
  if(allowedDomains.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})


router.get("/test", (req, res) => {
  console.log("Hello world");
  return res.status(200).send("Hello the world");
});

router.use("/auth", auth);
router.use("/user", user);

// TODO
router.use("/contracts/posts/replies", replies);
router.use("/contracts/posts", posts);
router.use("/contracts", contracts);
router.use("/scrape", scrape);

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

app.use(express.static("public"));

app.use("/api", router);

app.use(errorHandler);

app.listen(port, () => console.log("Server is running on " + port));
