const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  id: String,
  type: String,
  color: String,
  size: String,
  stock: Number
});

module.exports = mongoose.model("Item", itemSchema);
