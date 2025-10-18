import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  date: String,
  numbers: [Number],
  powerball: Number
});

export default mongoose.model("Result", resultSchema);
