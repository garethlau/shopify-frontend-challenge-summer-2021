const express = require("express");
const router = express.Router();

router.get("/health", (_, res) => {
  return res.status(200).send({ message: "Server is healthy." });
});
router.use("/api/ballots", require("./ballots"));
router.use("/api/movies", require("./movies"));

module.exports = router;
