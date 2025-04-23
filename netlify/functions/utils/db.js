const mongoose = require("mongoose");
let conn = null;

exports.connectDB = async () => {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conn;
};