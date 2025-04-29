const { Schema, model } = require("mongoose");

const cvSchema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: "User", required: true },
  filename:    { type: String, required: true },
  contentType: { type: String, required: true },
  data:        { type: Buffer, required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = model("CV", cvSchema);