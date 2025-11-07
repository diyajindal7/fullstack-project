// backend/validators/user.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(128).required(),
  // optional phone: allow empty string or null so missing phone is fine
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional().allow('', null),
  // role maps to your DB column user_type; keep it optional and restrict values
  // Accept 'organization' from frontend and map to 'ngo' in database
  role: Joi.string().valid('individual', 'ngo', 'organization').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
