const { celebrate, Joi } = require('celebrate');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
});

module.exports = { validateLogin, validateRegistration };
