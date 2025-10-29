// validators/deviceSchemas.js
const Joi = require('joi');

const createDevice = Joi.object({
  network_id: Joi.number().integer().positive().required()
    .messages({ 'any.required': 'network_id es requerido', 'number.base': 'network_id debe ser un número' }),
  name: Joi.string().min(1).max(200).required().messages({ 'any.required': 'name es requerido' }),
  device_type: Joi.string().min(1).max(100).required().messages({ 'any.required': 'device_type es requerido' }),
  ip_address: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).allow(null, '').optional(),
  mac_address: Joi.string().max(50).allow(null, '').optional(),
  location: Joi.string().max(255).allow(null, '').optional(),
  image_id: Joi.number().integer().positive().allow(null).optional(),
  metadata: Joi.any().optional()
});

const updateDevice = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  device_type: Joi.string().min(1).max(100).optional(),
  ip_address: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).allow(null, '').optional(),
  mac_address: Joi.string().max(50).allow(null, '').optional(),
  location: Joi.string().max(255).allow(null, '').optional(),
  image_id: Joi.number().integer().positive().allow(null).optional(),
  metadata: Joi.any().optional()
}).min(1).messages({ 'object.min': 'Nada para actualizar' });

module.exports = { createDevice, updateDevice };