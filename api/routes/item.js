const express = require("express");
const router = express.Router();

const checkAuth = require("../middlewares/authorization");
const ItemController = require("../controllers/item");

router.get("/:id", ItemController.item_get_by_id);

router.patch("/:id", checkAuth, ItemController.item_update_by_id);

router.delete("/:id", checkAuth, ItemController.item_delete_by_id);

module.exports = router;
