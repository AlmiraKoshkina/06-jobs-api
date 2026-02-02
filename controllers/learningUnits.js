const LearningUnit = require("../models/LearningUnit");
const { StatusCodes } = require("http-status-codes");

const getAllLearningUnits = async (req, res) => {
  const units = await LearningUnit.find({
    createdBy: req.user.userId,
  }).sort("-createdAt");

  res.status(StatusCodes.OK).json({ count: units.length, units });
};

const createLearningUnit = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const unit = await LearningUnit.create(req.body);

  res.status(StatusCodes.CREATED).json({ unit });
};

const getLearningUnit = async (req, res) => {
  const { id: unitId } = req.params;

  const unit = await LearningUnit.findOne({
    _id: unitId,
    createdBy: req.user.userId,
  });

  if (!unit) {
    const error = new Error("LearningUnit not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  res.status(StatusCodes.OK).json({ unit });
};

const updateLearningUnit = async (req, res) => {
  const { id: unitId } = req.params;

  const unit = await LearningUnit.findOneAndUpdate(
    { _id: unitId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!unit) {
    const error = new Error("LearningUnit not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  res.status(StatusCodes.OK).json({ unit });
};

const deleteLearningUnit = async (req, res) => {
  const { id: unitId } = req.params;

  const unit = await LearningUnit.findOneAndDelete({
    _id: unitId,
    createdBy: req.user.userId,
  });

  if (!unit) {
    const error = new Error("LearningUnit not found");
    error.statusCode = StatusCodes.NOT_FOUND;
    throw error;
  }

  res.status(StatusCodes.OK).json({ msg: "Deleted", unit });
};

module.exports = {
  getAllLearningUnits,
  createLearningUnit,
  getLearningUnit,
  updateLearningUnit,
  deleteLearningUnit,
};
