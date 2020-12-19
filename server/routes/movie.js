const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const axios = require("axios");
const querystring = require("querystring");

router.get("/", async (req, res) => {
  const { title = "" } = req.query;
  if (!title || title === "") {
    return res.status(401).send({ message: "" });
  }
  try {
    const params = querystring.stringify({
      s: title,
    });
    const uri = "http://www.omdbapi.com/?&apikey=4ad65c88&" + params;
    const response = await axios.get(uri);
    const { data } = response;
    const movies = data.Search;
    if (!movies) {
      return res.status(200).send({ movies: [] });
    }
    return res.status(200).send({ movies });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.get("/:imdbID", async (req, res) => {
  const { imdbID } = req.params;
  try {
    const uri = "http://www.omdbapi.com/?&apikey=4ad65c88&i=" + imdbID;
    const response = await axios.get(uri);
    const { data } = response;
    return res.status(200).send({ movie: data });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
