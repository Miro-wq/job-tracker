const mongoose = require("mongoose");
let conn = null;

exports.connectDB = async () => {
  if (conn) return conn;
  console.log("▶️ MONGODB_URI =", process.env.MONGODB_URI);
  conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conn;
};