const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/authorization");
const ItemController = require("../controllers/item");

router.post("/", checkAuth, ItemController.items_create);

router.get("/", ItemController.items_get_all);

module.exports = router;
