const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order");

router.get("/:id", OrderController.order_get_by_id);

module.exports = router;
