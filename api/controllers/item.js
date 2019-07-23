const mongoose = require("mongoose");

const Item = require("../models/item");

// Read item by id
exports.item_get_by_id = (req, res) => {
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
};

// Update item stock value by id
exports.item_update_by_id = (req, res) => {
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
};

// Delete item by id
exports.item_delete_by_id = (req, res) => {
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
};

// Create new items. If the item already exists then increase its quantity.
exports.items_create = async (req, res) => {
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
        res.status(400).json({
          success: false,
          message: "One (or more) items are invalid"
        });
        // Return false if items not valid
        valid = false;
        return valid;
      }
    }
    if (valid) {
      // Array to store items id
      const itemIds = [];
      for (const v of itemList) {
        await Item.findOne({
          type: v.type,
          color: v.color,
          size: v.size
        })
          .exec()
          .then(async result => {
            // If the item not exists, add new item
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
              // If the item exists, increase its quantity
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
};

// Get all items
exports.items_get_all = (req, res) => {
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
};
