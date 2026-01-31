const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authentication");
const {
  getAllLearningUnits,
  createLearningUnit,
  getLearningUnit,
  updateLearningUnit,
  deleteLearningUnit,
} = require("../controllers/learningUnits");

router.use(authenticateUser);

router.route("/").get(getAllLearningUnits).post(createLearningUnit);
router
  .route("/:id")
  .get(getLearningUnit)
  .patch(updateLearningUnit)
  .delete(deleteLearningUnit);

module.exports = router;
