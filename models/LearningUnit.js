const mongoose = require("mongoose");

const ChecklistItemSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const LearningUnitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },

    progress: {
      type: String,
      enum: ["not_started", "in_progress", "mastered"],
      default: "not_started",
      required: true,
    },

    links: { type: [String], default: [] },
    notes: { type: String, default: "" },
    checklist: { type: [ChecklistItemSchema], default: [] },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningUnit", LearningUnitSchema);
