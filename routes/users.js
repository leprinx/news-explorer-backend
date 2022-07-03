const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser } = require('../controllers/users');

const validateAuthHeaders = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

router.get(
  '/me',
  celebrate({
    headers: validateAuthHeaders,
  }),
  getUser,
);

module.exports = router;
