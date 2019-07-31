const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  id: String,
  itemId: { type: String, ref: "Item" },
  quantity: Number
});

module.exports = mongoose.model("Order", orderSchema);
