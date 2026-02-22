import mongoose from "mongoose";
import { User } from "./users.js";


const OpeartionSchema = new mongoose.Schema({
  // title task
  directive: {
    type: String,
    required: true,
    trim: true,
  },

  // task descripton details
  intel: {
    type: String,
    default: "NO_ADDITIONAL_DATA_FOUND",
  },

  // task status
  exectuion_status: {
    type: String,
    enum: ["Initialized", "In Progress", "Completed", "Failed"],
    default: "Initialized",
  },

  //priority level
  threat_level: {
    type: String,
    enum: ["LOW_THREAT", "MEDIUM_THREAT", "HIGH_THREAT", "CRITICAL"],
    default: "LOW_THREAT",
  },

  // link to user
  agent_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Identity",
    required: true,
  },

  // target comppletion data
  termination_data:{
    type:Date,
  },

  //Metadata tags (eg:"Personal","Word")
  sector_tags:[String],

  initialized_at:{
    type:Date,
    default:Date.now,
  },
});


export const Operation = mongoose.model("Operation",OpeartionSchema);