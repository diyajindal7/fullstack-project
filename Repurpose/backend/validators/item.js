// backend/validators/item.js
const Joi = require('joi');

const itemSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow('').optional(),
  category_id: Joi.number().integer().required()
  // image_url and location removed - columns may not exist in all databases
});

module.exports = { itemSchema };
