const { Schema, model } = require("mongoose");
const jobSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
  title:       String,
  company:     String,
  url:         String,
  status:      { type: String, enum: ["saved","applied","rejected","ghosted"], default: "saved" },
  createdAt:   { type: Date, default: Date.now },
});
module.exports = model("Job", jobSchema);