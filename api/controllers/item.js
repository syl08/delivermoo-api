const mongoose = require("mongoose");

const Item = require("../models/item");

// Read item by id
exports.item_get_by_id = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).select(
      "type color size stock"
    );
    if (item) {
      return res.status(200).json({ success: true, item });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item could not be found" });
    }
  } catch (err) {
    res.status.json({ success: false, message: err.message });
  }
};

// Update item stock value by id
exports.item_update_by_id = async (req, res) => {
  try {
    if (!req.body.stock || isNaN(req.body.stock) || req.body.stock < 1) {
      return res
        .status(400)
        .json({ success: false, messsage: "Invalid request" });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, {
      stock: req.body.stock
    });
    if (item) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item could not be found" });
    }
  } catch (err) {
    res.status.json({ success: false, message: err.message });
  }
};

// Delete item by id
exports.item_delete_by_id = async (req, res) => {
  try {
    const item = await Item.findByIdAndRemove(req.params.id);
    if (item) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item could not be found" });
    }
  } catch (err) {
    res.status.json({ success: false, message: err.message });
  }
};

// Create new items. If the item already exists then increase its quantity.
exports.items_create = async (req, res) => {
  // Validate req.body
  if (!req.body.items) {
    return res
      .status(400)
      .json({ success: false, messsage: "Invalid request" });
  } else {
    const itemList = req.body.items;
    for (const v of itemList) {
      if (
        !v.type ||
        !v.color ||
        !(v.size.length === 1 && "SML".indexOf(v.size) > -1) ||
        isNaN(v.stock) ||
        v.stock < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "One (or more) items are invalid"
        });
      }
    }
    // Array to store items id
    const itemIds = [];
    try {
      for (const v of itemList) {
        const result = await Item.findOne({
          type: v.type,
          color: v.color,
          size: v.size
        });
        // If the item exists, increase its quantity
        if (result) {
          await result.updateOne({ $inc: { stock: v.stock } });
          await itemIds.push(result._id);
        } else {
          // If the item not exists, add new item
          const item = new Item({
            _id: mongoose.Types.ObjectId().toString(),
            type: v.type,
            color: v.color,
            size: v.size,
            stock: v.stock
          });
          await item.save();
          await itemIds.push(item._id);
        }
      }
      res.status(200).json({ success: true, itemIds });
    } catch (err) {
      res.json({ success: false, message: err.message });
    }
  }
};

// Get all items
exports.items_get_all = async (req, res) => {
  try {
    const items = await Item.find().select("type color size stock");
    res.status(200).json({
      success: true,
      items: items
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
