export const errorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError") {
    // Handle validation errors
    const validationErrors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    return res.status(400).json({ errors: validationErrors });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    const validationErrors = err.errors.map((error) => ({
      field: error.path,
      message: `${error?.path} already exists`,
    }));
    return res.status(409).json({ errors: validationErrors });
  } else if (err.name === "ValidationError") {
    const yupErrors = {};
    err.inner.forEach((e) => {
      yupErrors[e.path] = e.message;
    });
    return res
      .status(400)
      .json({ message: "Validation error", errors: yupErrors });
  } else {
    // Handle other types of errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
