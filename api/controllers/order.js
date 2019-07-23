const mongoose = require("mongoose");

const Order = require("../models/order");
const Item = require("../models/item");

// Get order by id
exports.order_get_by_id = (req, res) => {
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
};

// Create an order to a specific item
exports.create_order = (req, res) => {
  // Validate body
  if (!(req.body.itemId && req.body.quantity)) {
    return res
      .status(400)
      .json({ success: false, messsage: "Invalid request" });
  } else {
    // Find item
    Item.findById({ _id: req.body.itemId })
      .exec()
      .then(item => {
        if (!item) {
          return res
            .status(404)
            .json({ success: false, message: "Item could not be found" });
        } else {
          // Check the item's stock
          if (item.stock < req.body.quantity) {
            return res.status(404).json({
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
            order
              .save()
              .then(result => {
                res.status(201).json({
                  success: true,
                  order: {
                    _id: result._id,
                    itemId: result.itemId,
                    quantity: result.quantity
                  }
                });
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
  }
};

// Get all orders
exports.orders_get_all = (req, res) => {
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
};
