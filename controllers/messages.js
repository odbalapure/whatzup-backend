const Message = require("../models/Message");

/**
 * @desc Get all announcements
 * @param {*} req
 * @param {*} res
 */
const getAllMessagesInEvent = async (req, res) => {
  try {
    const messages = await Message.find({ eventId: req.params.id });
    res.status(200).json({ messages });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong while fetching messages for this event..." });
  }
};

module.exports = {
  getAllMessagesInEvent
};
