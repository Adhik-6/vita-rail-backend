export default function errorHandler(err, req, res, next) {
  console.error("💥 Error occurred:", err);

  let statusCode = err.statusCode || 500;
  let message = "Internal Server Error";

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    const allMessages = Object.values(err.errors).map(e => e.message);
    message = allMessages.join(", ");
  }

  // Duplicate key errors (MongoError code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    const duplicatedFields = Object.keys(err.keyValue);
    const allMessages = duplicatedFields.map(
      (field) => `${field} "${err.keyValue[field]}" already exists`
    );
    message = allMessages.join(", ");
  }

  // Custom thrown or unknown errors
  else if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}
