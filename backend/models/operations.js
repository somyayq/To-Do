import mongoose from "mongoose";

const OperationSchema = new mongoose.Schema({
  // Title of the task
  directive: {
    type: String,
    required: true,
    trim: true,
  },

  // Task description/details
  intel: {
    type: String,
    default: "NO_ADDITIONAL_DATA_FOUND",
  },

  // Task status (Matches the UPPERCASE OS theme)
  execution_status: {
    type: String,
    enum: ["INITIALIZED", "IN_PROGRESS", "TERMINATED", "FAILED"],
    default: "INITIALIZED",
  },

  // Priority level (Used for the "Star/Important" logic)
  threat_level: {
    type: String,
    enum: ["LOW_THREAT", "MEDIUM_THREAT", "HIGH_THREAT", "CRITICAL"],
    default: "LOW_THREAT",
  },

  // Link to user (Identity)
  agent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Identity", // Ensure this matches your User model name
    required: true,
  },

  // Target completion date (Fixed typo from 'data' to 'date')
  termination_date: {
    type: Date,
  },

  // Metadata tags (e.g., "Work", "Personal")
  sector_tags: [String],

  initialized_at: {
    type: Date,
    default: Date.now,
  },

  termination_date: {
    type: Date,
    default: null,
  },

  reminder_time: {
    type: String,
    default: null,
  },
});

export const Operation = mongoose.model("Operation", OperationSchema);
