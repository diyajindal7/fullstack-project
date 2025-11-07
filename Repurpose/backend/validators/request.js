const Joi = require('joi');

const requestSchema = Joi.object({
    item_id: Joi.number().integer().required()
    // quantity_needed removed - column may not exist in all databases
});

module.exports = { requestSchema };
