var express = require("express");
var Score = require("../models/score");
var scoreController = require("../controllers/scoreController");
var router = express.Router();

/* GET home page. */
router.get("/", scoreController.index);
// POST request for creating a new table
router.post("/create", scoreController.create);

router.get("/score/", function (req, res, next) {
  Score.findOne().exec((err, score) => {
    if (err) next(err);
    //haku onnistui
    //lähetetään tietokannasta löytynyt data
    res.json(score);
  });
});
module.exports = router;
