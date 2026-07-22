import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/users.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const result = await User.updateMany(
  { income: { $exists: false } },
  { $set: { income: 0 } }
);

console.log(result);

await mongoose.disconnect();