const express = require("express");
const router = express.Router();
const Order = require("../models/order");

router.get("/:id", (req, res) => {
  Order.findOne({ _id: req.params.id })
    .select("_id itemId quantity")
    .exec()
    .then(result => {
      if (result) {
        res.json({ success: true, order: result });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Order could not be found" });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Order could not be found" });
    });
});

module.exports = router;
