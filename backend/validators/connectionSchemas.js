const Joi = require('joi');

const createConnection = Joi.object({
  network_id: Joi.number().integer().positive().required(),
  from_device_id: Joi.number().integer().positive().required(),
  to_device_id: Joi.number().integer().positive().required(),
  link_type: Joi.string().max(100).allow(null, '').optional(),
  status: Joi.string().valid('unknown','up','down').default('unknown')
}).custom((val, helpers) => {
  if (val.from_device_id === val.to_device_id) {
    return helpers.error('any.custom', 'from_device_id y to_device_id no pueden ser iguales');
  }
  return val;
}).messages({ 'any.custom': 'from_device_id y to_device_id no pueden ser iguales' });

const updateConnection = Joi.object({
  from_device_id: Joi.number().integer().positive().optional(),
  to_device_id: Joi.number().integer().positive().optional(),
  link_type: Joi.string().max(100).allow(null, '').optional(),
  status: Joi.string().valid('unknown','up','down').optional()
}).min(1).messages({ 'object.min': 'Nada para actualizar' });

module.exports = { createConnection, updateConnection };