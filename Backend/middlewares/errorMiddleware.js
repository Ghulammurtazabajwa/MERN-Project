const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    error.message = "Invalid ID format";
    error.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors).map((val) => val.message).join(", ");
    error.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;