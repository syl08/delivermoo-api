const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Item = require("../models/item");
const checkAuth = require("../middlewares/authorization");

router.post("/", checkAuth, async (req, res) => {
  const itemList = req.body.items;
  // Validate req.body
  if (!req.body.items) {
    return res
      .status(400)
      .json({ success: false, messsage: "Invalid request" });
  } else {
    // Validate items, default is true
    let valid = true;
    for (const v of itemList) {
      if (
        !v.type ||
        !v.color ||
        !(v.size.length === 1 && "SML".indexOf(v.size) > -1) ||
        v.stock < 1
      ) {
        res.json({
          success: false,
          message: "One (or more) items are invalid"
        });
        // Return false if items not valid
        valid = false;
        return valid;
      }
    }
    if (valid) {
      const itemIds = [];
      for (const v of itemList) {
        await Item.findOne({
          type: v.type,
          color: v.color,
          size: v.size
        })
          .exec()
          .then(async result => {
            if (!result) {
              const item = new Item({
                _id: mongoose.Types.ObjectId().toString(),
                type: v.type,
                color: v.color,
                size: v.size,
                stock: v.stock
              });
              await item
                .save()
                .then(result => {
                  itemIds.push(result._id);
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              await result
                .updateOne({ $inc: { stock: v.stock } })
                .then(doc => {
                  itemIds.push(result._id);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
      }
      res.json({ success: true, itemIds });
    }
  }
});

router.get("/", (req, res) => {
  Item.find()
    .select("id type color size stock")
    .exec()
    .then(items => {
      res.json({
        success: true,
        items: items
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
