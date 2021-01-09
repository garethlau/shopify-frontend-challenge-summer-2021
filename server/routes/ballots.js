const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose");
const axios = require("axios");
const Ballot = mongoose.model("Ballot");
const keys = require("../config/keys");
const {
  subscribe,
  notifyClients,
  EventTypes,
} = require("../services/subscription");

/**
 * Create new ballot
 */
router.post("/", async (req, res) => {
  const buf = crypto.randomBytes(3);
  const code = buf.toString("hex").toUpperCase();

  try {
    const ballot = await new Ballot({ code, nominations: [] }).save();
    return res.status(200).send({ ballot });
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Get a ballot by the code
 */
router.get("/:ballotCode", async (req, res) => {
  const { ballotCode } = req.params;
  try {
    const ballot = await Ballot.findOne({ code: ballotCode }).exec();
    if (!ballot) {
      return res.status(404).send({ ballot: null });
    }
    return res.status(200).send({ ballot });
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Get nominated movies
 */

router.get("/:ballotCode/movies", async (req, res) => {
  const { ballotCode } = req.params;
  try {
    const ballot = await Ballot.findOne({ code: ballotCode }).exec();
    if (!ballot) {
      return res.status(404).send({ nominations: null });
    }
    const { nominations } = ballot;
    let promises = nominations.map(
      (imdbID) =>
        new Promise((resolve, reject) => {
          const uri = `http://www.omdbapi.com/?&apikey=${keys.OMDB_API_KEY}&i=${imdbID}`;
          axios
            .get(uri)
            .then((response) => {
              resolve(response.data);
            })
            .catch((error) => {
              reject(error);
            });
        })
    );

    let movies = await Promise.all(promises);
    return res.status(200).send({ movies });
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Nominate a movie as apart of the ballot
 */
router.patch("/:ballotCode/nominate", async (req, res) => {
  const { ballotCode } = req.params;
  const { imdbID, action } = req.body;
  // return res.status(500).send();
  try {
    let ballot = await Ballot.findOne({ code: ballotCode }).exec();
    let prevNominations = ballot.nominations;

    if (action === "nominate") {
      // Nominate a movie
      ballot.nominations = [...prevNominations, imdbID];
    } else {
      // Remove nomination
      ballot.nominations = ballot.nominations.filter((x) => x !== imdbID);
    }

    let updatedBallot = await ballot.save();
    notifyClients(ballotCode, EventTypes.NOMINATIONS_UPDATED);
    return res.status(200).send({ ballot: updatedBallot });
  } catch (error) {
    return res.status(500).send();
  }
});

/**
 * Subscribe to events
 */

router.get("/:ballotCode/subscribe", subscribe);

/**
 * Delete a ballot
 */
router.delete("/:ballotCode", async (req, res) => {
  const { ballotCode } = req.params;
  try {
    await Ballot.findOneAndDelete({ code: ballotCode });
    notifyClients(ballotCode, EventTypes.BALLOT_DELETED);
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send();
  }
});

module.exports = router;
