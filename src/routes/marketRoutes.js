const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const { getPtsUnit, getUSDTValue } = require("../utils/ptsUnit");

// Define your routes here
router.get("/", async (req, res) => {
  res.send("market");
});

router.get("/poolinfo", async (req, res) => {
  res.send("market -> poolinfo");
});

// currencyType = ETH / BNB / ...
router.post("/depost", async (req, res) => {
  let { user, amount, currencyType } = req.body;

  // calc amout to $(USDT).
  let pt = 10;

  // increase totalPts.
  UserModel.increaseByUserId(user, pt)
    .then((data) => {
      res.send("increased pts");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.post("/borrow", async (req, res) => {
  let { user, amount, currencyType } = req.body;

  let pt = 10;

  // increase totalPts.
  UserModel.decreaseByUserId(user, pt)
    .then((data) => {
      res.send("increased pts");
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
