const { celebrate, Joi, Segments } = require('celebrate');

const loginValidator = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(128).required()
  })
});

const refreshValidator = celebrate({
  [Segments.BODY]: Joi.object({
    refreshToken: Joi.string().required()
  })
});

module.exports = { loginValidator, refreshValidator };