const Joi = require('joi');


function validate(schema) {
  return (req, res, next) => {
    const opts = { abortEarly: false, stripUnknown: true, convert: true };
    const { error, value } = schema.validate(req.body || {}, opts);
    if (error) {
      const msg = error.details.map(d => d.message).join('; ');
      return res.status(400).json({ error: `Payload inválido: ${msg}` });
    }
    req.body = value; 
    return next();
  };
}

module.exports = validate;