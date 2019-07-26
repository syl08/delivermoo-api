const mongoose = require("mongoose");

const Order = require("../models/order");
const Item = require("../models/item");

// Get order by id
exports.order_get_by_id = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id }).select(
      "_id itemId quantity"
    );
    if (order) {
      return res.json({ success: true, order });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order could not be found" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

// Create an order to a specific item
exports.create_order = async (req, res) => {
  // Validate body
  if (!req.body.itemId || isNaN(req.body.quantity) || req.body.quantity < 1) {
    return res
      .status(400)
      .json({ success: false, messsage: "Invalid request" });
  }
  try {
    const item = await Item.findById({ _id: req.body.itemId });
    if (item) {
      // Check the item's stock
      if (item.stock < req.body.quantity) {
        return res.json({
          success: false,
          message: "Item does not have enough stock"
        });
      } else {
        // If item found and have enough stock, then create new order
        const order = new Order({
          _id: mongoose.Types.ObjectId().toString(),
          itemId: req.body.itemId,
          quantity: req.body.quantity
        });
        await order.save();
        res.status(201).json({
          success: true,
          order: {
            _id: order._id,
            itemId: order.itemId,
            quantity: order.quantity
          }
        });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Item could not be found" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

// Get all orders
exports.orders_get_all = async (req, res) => {
  try {
    const orders = await Order.find().select("_id itemId quantity");
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};
