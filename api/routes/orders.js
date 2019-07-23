const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order");

router.post("/", OrderController.create_order);

router.get("/", OrderController.orders_get_all);

module.exports = router;
