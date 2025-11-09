// backend/validators/item.js
const Joi = require('joi');

const itemSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow('').optional(),
  category_id: Joi.number().integer().required(),
  location: Joi.string().max(255).allow('').optional()
});

module.exports = { itemSchema };
