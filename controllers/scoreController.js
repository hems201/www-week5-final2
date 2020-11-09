var Score = require("../models/score");

//validation
//const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.index = function (req, res, next) {
  Score.findOne().exec(function (err, score) {
    if (err) {
      return next(err);
    }
    //ladataan viimeisin score
    if (score) {
      res.render("index", {
        markup: score.markup
      });
    } else {
      //succesfull
      res.render("index", {}); //player, markup
    }
  });
};
//handle saving new table after each click
exports.create = function (req, res, next) {
  sanitizeBody("*").trim().escape();

  Score.findOneAndUpdate(
    { scoreID: "0" },
    {
      scoreID: req.body.scoreID, //ScoreID
      markup: req.body.markup,
      player: req.body.player,
      turn: req.body.turn,
      status: req.body.status
    },
    { upsert: true }, // create new if nothing matches filter
    (err, doc) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to main view
      res.redirect("/");
    }
  );
};
