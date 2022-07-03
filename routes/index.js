const router = require('express').Router();
const usersRouter = require('./users');
const newsRouter = require('./news');
const auth = require('../middlewares/auth');
const { validateLogin, validateRegistration } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegistration, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/articles', newsRouter);

module.exports = router;
