var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ScoreSchema = new Schema({
  scoreID: { type: String }, //ScoreID
  markup: { type: [] }, //board
  player: { type: String }, //player status
  turn: { type: String }, //turn counter
  status: { type: String } //game on/over
});

module.exports = mongoose.model("Score", ScoreSchema);
