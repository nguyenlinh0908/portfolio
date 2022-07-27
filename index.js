require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const app = express();
const routerNormal = require("./routers/normal");
const routerAuth = require("./routers/auth");
const path = require("path");
const multer = require("multer");
const PORT = process.env.PORT || 8000;
//
const MongoStore = require("connect-mongo");
const session = require("express-session");
//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());

// config connect-mongo
app.use(
  session({
    secret: process.env.PRIVATE_KEY,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      autoRemove: "interval",
      autoRemoveInterval: 60,
      crypto: {
        secret: process.env.PRIVATE_KEY,
      }, // In minutes. Default
    }),
  })
);
/* */
app.use("/api/v1", routerNormal);
app.use("/api/v1", routerAuth);
app.listen(PORT, () => {
  connectDB(process.env.DATABASE_URL);
  console.log(`server is running in port ${PORT}`);
});
