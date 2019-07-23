const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const checkAuth = require("../middlewares/authorization");

router.get("/:id", (req, res) => {
  Item.findOne({ _id: req.params.id })
    .select("_id type color size stock")
    .exec()
    .then(result => {
      if (result) {
        res.json({ success: true, item: result });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Item could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Item could not be found" });
    });
});

router.patch("/:id", checkAuth, (req, res) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, { stock: req.body.stock })
    .exec()
    .then(result => {
      if (result) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Item could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});

router.delete("/:id", checkAuth, (req, res) => {
  Item.findByIdAndRemove({ _id: req.params.id })
    .exec()
    .then(result => {
      if (result) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Item could not be found" });
      }
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;
