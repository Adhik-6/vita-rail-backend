
export default function errorHandler(err, req, res, next) {
  console.error("You've got an Error occurred:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
}