const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes/index');
const error = require('./middlewares/error');

const { NODE_ENV, MONGO_URL } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.use(rateLimiter);

app.use(routes);
app.use(errors());
app.use(errorLogger);
app.use('', error);


