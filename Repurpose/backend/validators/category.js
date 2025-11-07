// backend/validators/category.js
const Joi = require('joi');

// Validation schema for category
const categorySchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).allow('').optional()
});

module.exports = { categorySchema };
