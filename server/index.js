const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const keys = require("./config/keys");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "dev";

const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000/",
  "https://shoppies.garethdev.space",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not allowed by cors`));
    }
  },
  credentials: true,
};

require("./mongo");
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(require("./routes"));

app.listen(PORT, () => {
  if (NODE_ENV === "production") {
    console.log("ENVIRONMENT IS PROD");
    app.use(express.static(path.join(__dirname, "..", "client", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    });
  } else {
    console.log("ENVIRONMENT IS DEV");
  }
  console.log("Listening on port " + PORT);
});
