import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Recommended for unique Node IDs

const IdentitySchema = new mongoose.Schema({
  // Matches "IDENTITY HANDLE" in UI
  identity_handle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  // Terminal/Cyberpunk apps still need emails, but we can call the field "uplink" or keep email
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  // Matches "ACCESS KEY" in UI
  access_key_hash: {
    type: String,
    required: true,
  },

  // Every OS user needs a designated Node ID (e.g., NODE-4402)
  node_id: {
    type: String,
    unique: true,
    default: () => `NODE-${Math.floor(1000 + Math.random() * 9000)}`,
  },

  // Matches "SYSTEM_STATUS" in the footer of your UI
  system_status: {
    type: String,
    enum: ["READY", "OFFLINE", "MAINTENANCE", "COMPROMISED"],
    default: "READY",
  },

  // Security clearance level (1 = Guest, 2 = Agent, 3 = Root/Admin)
  clearance_level: {
    type: Number,
    default: 1,
  },

  // Terminal flavored timestamps
  initialized_at: {
    type: Date,
    default: Date.now,
  },

  last_uplink: {
    type: Date,
    default: Date.now,
  },
});

// Rename the model to "Identity" to match the "Identity verification" text
export const User = mongoose.model("Identity", IdentitySchema);
