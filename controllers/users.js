const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/userSchema');
const {
  BAD_REQUEST,
  NOT_FOUND, SUCCES,
  CONFLICT_ERROR,
  CREATED_SUCCES,
  UNAUTHORIZED,
} = require('../utils/errorHandlers');
const ErrorHandler = require('../utils/errorClass');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    username,
    email,
    password,
  } = req.body;
  Users.findOne({
    $or: [{
      username: username,
    }, {
      email: email,
    }],
  })
    .then((user) => {
      if (user) {
        throw new ErrorHandler(
          'Email or username already registered',
          CONFLICT_ERROR,
        );
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => {
      Users.create({
        username,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED_SUCCES).send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(
              new ErrorHandler(
                'Wrong information format was entered',
                BAD_REQUEST,
              ),
            );
          }
          if (err.name === 'Reqested resource not found') {
            return next(
              new ErrorHandler(
                'Unable to acces the users, please check url',
                NOT_FOUND,
              ),
            );
          }
          return next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'test-string',
        {
          expiresIn: '7d',
        },
      );
      res.status(SUCCES).send({ data: user, token });
    })
    .catch(() => {
      next(new ErrorHandler('Invalid email or password!!!', UNAUTHORIZED));
    });
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  Users.findById(id)
    .then((user) => res.status(SUCCES).send(user))
    .catch(next);
};

module.exports = {
  login,
  createUser,
  getUser,
};
