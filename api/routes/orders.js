const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/order");
const Item = require("../models/item");

router.post("/", (req, res) => {
  if (!(req.body.itemId && req.body.quantity)) {
    return res
      .status(400)
      .json({ success: false, messsage: "Invalid request" });
  } else {
    Item.findById({ _id: req.body.itemId })
      .exec()
      .then(item => {
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: "Item could not be found" });
        } else {
          if (item.stock < req.body.quantity) {
            return res.status(404).json({
              success: false,
              message: "Item does not have enough stock"
            });
          } else {
            const order = new Order({
              _id: mongoose.Types.ObjectId().toString(),
              itemId: req.body.itemId,
              quantity: req.body.quantity
            });
            order
              .save()
              .then(result => {
                res.status(201).json({ success: true, order: order });
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
  }
});

router.get("/", (req, res) => {
  Order.find()
    .select("_id itemId quantity")
    .exec()
    .then(orders => {
      res.json({
        success: true,
        orders: orders
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
