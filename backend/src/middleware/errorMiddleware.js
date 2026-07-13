export const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.code === "P2002") {
    const fields = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : "unique field";

    return res.status(409).json({
      success: false,
      message: `A record with this ${fields} already exists.`,
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "The requested record was not found.",
    });
  }

  if (error.code === "P2003") {
    return res.status(400).json({
      success: false,
      message:
        "This operation could not be completed because of a related record.",
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : error.message || "Internal server error.",
  });
};