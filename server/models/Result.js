import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    numbers: {
      type: [Number],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === 5 && arr.every(n => n >= 1 && n <= 69);
        },
        message: "Numbers must be an array of 5 integers between 1 and 69."
      }
    },
    powerball: {
      type: Number,
      required: true,
      min: 1,
      max: 26
    },
    jackpot: {
      type: String,
      default: "Unknown"
    },
    multiplier: {
      type: Number,
      default: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "results",
    timestamps: true
  }
);

resultSchema.index({ date: 1 });
resultSchema.index({ "numbers": 1 });
resultSchema.index({ powerball: 1 });

export default mongoose.model("Result", resultSchema);