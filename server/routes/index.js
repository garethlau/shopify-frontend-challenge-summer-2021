const express = require("express");
const router = express.Router();
const apicache = require("apicache");

const cache = apicache.middleware;

router.get("/health", (_, res) => {
  return res.status(200).send({ message: "Server is healthy." });
});

router.use("/api/ballots", require("./ballots"));
router.use("/api/movies", cache("1 hour"), require("./movies"));

module.exports = router;
