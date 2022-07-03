const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUserSavedNews,
  addNews,
  deleteNews,
} = require('../controllers/news');

const validateAuthHeaders = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

const isUrl = (input) => {
  if (!validator.isURL(input)) {
    throw new Error('Not a valid url');
  }
  return input;
};

const validateBodyInfo = Joi.object().keys({
  keyword: Joi.string().required(),
  title: Joi.string().required(),
  text: Joi.string().required(),
  date: Joi.string().required(),
  source: Joi.string().required(),
  link: Joi.string().required().custom(isUrl),
  image: Joi.string().required().custom(isUrl),
  owner: Joi.string().required(),
});

const validateParams = Joi.object().keys({
  articleId: Joi.string().alphanum().length(24),
});

router.get(
  '',
  celebrate({
    headers: validateAuthHeaders,
  }),
  getUserSavedNews,
);

router.post(
  '',
  celebrate({
    headers: validateAuthHeaders,
    body: validateBodyInfo,
  }),
  addNews,
);

router.delete(
  '/:articleId',
  celebrate({
    params: validateParams,
    headers: validateAuthHeaders,
  }),
  deleteNews,
);

module.exports = router;
