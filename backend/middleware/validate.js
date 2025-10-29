const Joi = require('joi');

/**
 * Devuelve middleware express que valida req.body según el schema Joi.
 * - Si hay error devuelve 400 con mensajes consolidados.
 * - stripUnknown: true para limpiar campos inesperados.
 */
function validate(schema) {
  return (req, res, next) => {
    const opts = { abortEarly: false, stripUnknown: true, convert: true };
    const { error, value } = schema.validate(req.body || {}, opts);
    if (error) {
      const msg = error.details.map(d => d.message).join('; ');
      return res.status(400).json({ error: `Payload inválido: ${msg}` });
    }
    req.body = value; // cuerpo saneado
    return next();
  };
}

module.exports = validate;