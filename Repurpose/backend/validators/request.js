const Joi = require('joi');

const requestSchema = Joi.object({
    item_id: Joi.number().integer().required(),
    quantity_needed: Joi.number().integer().min(1).default(1),
    // You can add other fields if needed, e.g., status, requested_at, etc.
});

module.exports = { requestSchema };
