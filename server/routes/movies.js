const express = require("express");
const router = express.Router();
const keys = require("../config/keys");
const axios = require("axios");
const querystring = require("querystring");

router.get("/:imdbID", async (req, res) => {
  const { imdbID } = req.params;
  try {
    const uri = `http://www.omdbapi.com/?&apikey=${keys.OMDB_API_KEY}&i=${imdbID}`;
    const response = await axios.get(uri);
    const { data } = response;
    return res.status(200).send({ movie: data });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.get("/", async (req, res) => {
  const { title = "", page = 0 } = req.query;
  if (!title || title === "") {
    return res.status(422).send();
  }
  try {
    const params = querystring.stringify({
      s: title,
      page,
      type: "movie",
    });
    const uri = `http://www.omdbapi.com/?&apikey=${keys.OMDB_API_KEY}&${params}`;
    const response = await axios.get(uri);
    const { data } = response;
    const movies = data.Search;
    if (!movies) {
      return res.status(200).send({ movies: [] });
    }
    if (movies.length < 10) {
      return res.status(200).send({ movies });
    }
    let nextPage = parseInt(page) + 1;
    return res.status(200).send({ movies, nextPage });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

module.exports = router;
