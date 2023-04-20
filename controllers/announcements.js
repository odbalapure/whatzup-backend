const Announcement = require("../models/Announcement");
const { checkCache } = require("../utils/common");
const client = require("../utils/redis");

/**
 * @desc Get all announcements
 * @param {*} req
 * @param {*} res
 */
const getAllAnnouncements = async (req, res) => {
  try {
    checkCache(req, res, client, Announcement);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong while getting this announcements..."
    });
  }
};

/**
 * @desc Get urgent annoucements
 * @param {*} req
 * @param {*} res
 */
const getUrgentAnnouncements = async (req, res) => {
  try {
    const urgentAnnouncements = await Announcement.find({ importance: "HIGH" });
    res.status(201).json(urgentAnnouncements);
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong while getting announcements..." });
  }
};

/**
 * @desc Create an announcement
 * @param {*} req
 * @param {*} res
 */
const createAnnouncement = async (req, res) => {
  try {
    await Announcement.create({ ...req.body });

    res.status(203).json({ msg: "Annocument created successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong while creating announcement..." });
  }
};

/**
 * @desc Delete an announcement
 * @param {*} req
 * @param {*} res
 */
const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete({ _id: req.params.id });
    res.status(204).json({ msg: "Annocument deleted!" });
  } catch (err) {
    return res.status(500).json({
      msg: "Something went wrong while deleting this announcement..."
    });
  }
};

/**
 * @desc Edit an annoucement
 * @param {*} req
 * @param {*} res
 */
const editAnnoucement = async (req, res) => {
  try {
    await Announcement.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    });

    res.status(203).json({ msg: "Announcement edited!" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Something went wrong while editing this announcement..." });
  }
};

module.exports = {
  getAllAnnouncements,
  getUrgentAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  editAnnoucement
};
