require("dotenv").config();
const jwt     = require("jsonwebtoken");
const { connectDB } = require("./utils/db");
const CV      = require("./models/CV");

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();

  const auth = (event.headers.authorization || "").split(" ")[1];
  if (!auth) return { statusCode: 401, body: "Missing token" };
  let userId;
  try {
    userId = jwt.verify(auth, process.env.JWT_SECRET).userId;
  } catch {
    return { statusCode: 401, body: "Invalid token" };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        if (event.queryStringParameters?.id) {
          const cv = await CV.findOne({ _id: event.queryStringParameters.id, userId });
          if (!cv) return { statusCode: 404, body: "Not found" };
          return {
            statusCode: 200,
            headers: {
              "Content-Type": cv.contentType,
              "Content-Disposition": `attachment; filename="${cv.filename}"`
            },
            body: cv.data.toString("base64"),
            isBase64Encoded: true
          };
        }
        const list = await CV.find({ userId })
          .select("filename createdAt")
          .sort("-createdAt");
        return { statusCode: 200, body: JSON.stringify(list) };

      case "POST":
        const { filename, contentType, data } = JSON.parse(event.body);
        const buf = Buffer.from(data, "base64");
        const cv = await CV.create({ userId, filename, contentType, data: buf });
        return {
          statusCode: 201,
          body: JSON.stringify({
            _id: cv._id,
            filename: cv.filename,
            createdAt: cv.createdAt
          })
        };

      case "DELETE":
        const { id } = JSON.parse(event.body);
        await CV.findOneAndDelete({ _id: id, userId });
        return { statusCode: 200, body: JSON.stringify({ success: true }) };

      default:
        return { statusCode: 405, body: "Method not allowed" };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
