const express = require("express");
const router = express.Router();

const { getAllMessagesInEvent } = require("../controllers/messages");

router.get("/:id", getAllMessagesInEvent);

module.exports = router;
