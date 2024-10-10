function errorHandler(err, req, res, next) {
  // Handle JWT Unauthorized error
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  // Handle Mongoose Validation error
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: "Validation Error", details: err.message });
  }

  // Default to 500 server error for any other unhandled errors
  return res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
}

module.exports = errorHandler;
