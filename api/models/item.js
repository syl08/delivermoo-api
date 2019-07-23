const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  _id: String,
  type: String,
  color: String,
  size: String,
  stock: Number
});

module.exports = mongoose.model("Item", itemSchema);
