import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs"; // ADD THIS - you're using bcrypt but never imported it
import { User } from "./models/users.js";
import { Operation } from "./models/operations.js";

const app = express();
app.use(express.json());
app.use(cors());

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { identity_handle, email, access_key_hash } = req.body;

    if (!identity_handle || !email || !access_key_hash) {
      return res.status(400).send({ message: "INSUFFICIENT_DATA" });
    }

    const existingUser = await User.findOne({ identity_handle });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "ERROR: HANDLE_ALREADY_RESERVED" });
    }

    const salt = await bcrypt.genSalt(10);
    const secureHash = await bcrypt.hash(access_key_hash, salt);

    const identity = await User.create({
      identity_handle,
      email,
      access_key_hash: secureHash,
    });

    return res.status(201).send({
      status: "IDENTITY_INITIALIZED",
      message: `NODE ACCESS GRANTED FOR ${identity.node_id}`,
      payload: identity,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .send({ message: "IDENTITY_HANDLE or EMAIL already exists." });
    }
    res.status(500).send({ message: err.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { identity_handle, access_key_hash } = req.body;

    if (!identity_handle || !access_key_hash) {
      return res.status(400).send({ message: "Send all fields" });
    }

    const user = await User.findOne({ identity_handle });
    if (!user) {
      return res.status(404).send({ message: "IDENTITY_NOT_FOUND" });
    }

    const isMatch = await bcrypt.compare(access_key_hash, user.access_key_hash);
    if (!isMatch) {
      return res.status(401).send({ message: "INVALID_ACCESS_KEY" });
    }

    // Update last uplink
    user.last_uplink = Date.now();
    await user.save();

    return res.status(200).send({
      message: "LOGIN_SUCCESS",
      user: user, // fixed: was 'identity', frontend expects 'user'
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// GET OPERATIONS
app.get("/api/operations/:agent_id", async (req, res) => {
  // fixed: moved agent_id to params
  try {
    const operations = await Operation.find({
      agent_id: req.params.agent_id,
    }).sort({ initialized_at: -1 }); // fixed: toSorted -> .sort()
    res.status(200).json(operations);
  } catch (err) {
    res.status(500).json({ message: "FETCH_ERROR" });
  }
});

// TOGGLE OPERATION
app.patch("/api/operations/:id/toggle", async (req, res) => {
  try {
    const task = await Operation.findById(req.params.id);
    task.execution_status =
      task.execution_status === "TERMINATED" ? "ACTIVE" : "TERMINATED"; // fixed typo: exectuion_status
    await task.save();
    res.status(200).json(task); // fixed: was missing response
  } catch (err) {
    res.status(500).json({ message: "TOGGLE_ERROR" });
  }
});

// DELETE OPERATION
app.delete("/api/operations/:id", async (req, res) => {
  try {
    await Operation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "OPERATION_DELETED" });
  } catch (err) {
    res.status(500).json({ message: "DELETION_ERROR" }); // fixed typo
  }
});


app.patch("/api/v4/operations/:id/star", async (req, res) => {
    try {
        const task = await Operation.findById(req.params.id);
        // If it's already CRITICAL, make it LOW. If not, make it CRITICAL.
        task.threat_level = task.threat_level === "CRITICAL" ? "LOW_THREAT" : "CRITICAL";
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: "STAR_TOGGLE_ERROR" });
    }
});

// Example toggle route in index.js
app.patch("/api/operations/:id/toggle", async (req, res) => {
    const task = await Operation.findById(req.params.id);
    // Switch between INITIALIZED and TERMINATED
    task.execution_status = task.execution_status === "TERMINATED" ? "INITIALIZED" : "TERMINATED";
    await task.save();
    res.json(task);
});

// ADD OPERATION
app.post("/api/operations", async (req, res) => {
  try {
    const { directive, intel, threat_level, agent_id, termination_date , reminder_time} =
      req.body;

    if (!directive || !agent_id) {
      return res
        .status(400)
        .send({
          message: "VALIDATION_ERROR: directive and agent_id are required.",
        });
    }

    const operation = await Operation.create({
      directive,
      intel,
      threat_level,
      agent_id,
      termination_date,
      reminder_time,
    });

    return res.status(201).send({
      status: "OPERATION_DEPLOYED",
      message: `OPERATION ${operation._id} DEPLOYED`,
      payload: operation,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// PATCH: Toggle importance
app.patch("/api/operations/:id/star", async (req, res) => {
  try {
    const task = await Operation.findById(req.params.id);
    task.threat_level = task.threat_level === "CRITICAL" ? "LOW_THREAT" : "CRITICAL";
    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "STAR_TOGGLE_ERROR" });
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
