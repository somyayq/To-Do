import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import { User } from "./models/users.js";
import { Operation } from "./models/operations.js";

const app = express();

app.use(express.json());

app.use(cors());


// To initalize a new user/identity in the system
app.post("/api/signup", async (req, res) => {
    try {
        const { identity_handle, email, access_key_hash } = req.body;

        // Validation using the new schema names
        if (!identity_handle || !email || !access_key_hash) {
            return res.status(400).send({
                status: "AUTH_FAILURE",
                message: "INSUFFICIENT_DATA: identity_handle, email, and access_key_hash are required."
            });
        }

        // Check if the identity_handle or email already exists in the system
        const existingUser = await User.findOne({identity_handle});
        if(existingUser){
          return res.status(400).send({ message: "ERROR: HANDLE_ALREADY_RESERVED"});
        }

        // Hash the access key before storing
        const salt = await bcrypt.genSalt(10);
        const secureHash = await bcrypt.hash(access_key_hash, salt);

        // Creating the new identity object
        const newIdentity = {
            identity_handle: identity_handle,
            email: email,
            access_key_hash: secureHash,
        };

        const identity = await User.create(newIdentity);

        // Cyberpunk-themed success response
        return res.status(201).send({
            status: "IDENTITY_INITIALIZED",
            message: `NODE ACCESS GRANTED FOR ${identity.node_id}`,
            payload: identity
        });

    } catch (err) {
        console.error("[SYSTEM_CRITICAL_ERROR]:", err.message);
        
        if (err.code === 11000) {
            return res.status(409).send({
                status: "CONFLICT",
                message: "IDENTITY_HANDLE or EMAIL already exists in the central mainframe." + err.message
            });
        }

        res.status(500).send({
            status: "PROTOCOL_ERROR",
            message: "Internal System Failure during initialization."
        });
    }
});


app.post("/api/login",async(req,res)=>{
  try{
   const { identity_handle,access_key_hash } = req.body;

   if(!identity_handle || !access_key_hash){
    return res.status(400).send({
      message:"Send all fields: identity_handle and access_key_hash"})
   }

   //Find user y identity_handle
   const user = await User.findOne({identity_handle});
   if(!user){
    return res.status(401).send({message:"User not found"});
   }

   // Compare password
   const isMatch = await bcrypt.compare(access_key_hash,user.access_key_hash);
   if(!isMatch){
    return res.status(401).send({message:"Invalid credentials"});
   }

   return res.status(200).send({
    message:"LOGIN_SUCCESS",identity:user
   });
  }catch(err){
    res.status(500).send({message:err.message});
  }
});



// Endpoint to add the opearation in the system
app.post("/api/operations",async(req,res)=>{
  try{
    const {directive,intel,threat_level,agent_id,termination_date} = req.body;

    //validation
    if(!directive || !agent_id){
      return res.status(400).send({
        status:"DEPLOYEMENT_FAILED",
        message:"VALIDATION_ERROR: 'directive' and 'agent_id' are mandatroy for deployement."
      });
    }
    const newOp={
      directive,
      intel,
      threat_level,
      agent_id,
      termination_date
    };

    const operation = await Operation.create(newOp);

    return res.status(201).send({
      status:"OPERATION_DEPLOYED",
      message:`OPERATION ${operation._id} DEPLOYED TO NODE ${operation.agent_id}`,
      payload:operation
    });
  }catch(err){
   console.error("[OPS_CRITICAL_FAILURE]:", err.message);
    res.status(500).send({
      status: "SYSTEM_FAILURE",
      message: "Internal error during directive deployment."
    }); 
  }
});

app.post("/api/access",async(req,res)=>{
  try{
    const {identity_handle,access_key} = req.body;

    //1() find the identity
    const identity = await User.findOne({identity_handle});

    if(!identity){
      return res.status(401).send({
        status:"AUTH_FAILURE",
        message:"IDENTITY_NOT_FOUND: Access denied."
      });
    }

    // 2) check the password
    const isMatch = await bcrypt.compare(access_key, identity.access_key_hash);

    if(!isMatch){
      return res.status(401).send({
        status:"AUTH_FAILURE",
        message:"INVALID_ACCESS_KEY:Authnentication failed."
      });
    }

    //3) success
    return res.status(200).send({
      status:"ACCESS_GRANTED",
      message:`WELCOME BACK, ${identity.node_id}`,
      token:"fake-jwt-token",
      user:identity
    });
  }catch(err){
    res.status(500).send({
      status:"SYSTEM_ERROR",
      message: err.message
    });
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
