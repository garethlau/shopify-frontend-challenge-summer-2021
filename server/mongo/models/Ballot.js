const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BallotSchema = new Schema(
  {
    code: String,
    nominations: Array,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Ballot", BallotSchema);
