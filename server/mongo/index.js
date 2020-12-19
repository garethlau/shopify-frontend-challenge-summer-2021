const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose
  .connect(keys.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to mongo");
  })
  .catch((error) => {
    console.log("Error connecting to mongo");
    console.log(error);
  });

require("./models/Ballot");
