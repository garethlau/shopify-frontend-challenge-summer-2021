const express = require("express");
const router = express.Router();

router.get("/health", (_, res) => {
  return res.status(200).send({ message: "Server is healthy." });
});
router.use("/api/ballot", require("./ballot"));
router.use("/api/movie", require("./movie"));

module.exports = router;
