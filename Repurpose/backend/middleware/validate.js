// backend/middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return res.status(500).json({
        status: "error",
        message: "Validation schema is missing",
      });
    }

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    req.validated = value;
    next();
  };
};

module.exports = validate;
