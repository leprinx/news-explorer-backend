const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
const error = require('./middlewares/error');

const { NODE_ENV, MONGO_URL } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./utils/rateLimiter');

const app = express();
require('dotenv').config();
const { PORT = 3000 } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'http://localhost:3000/',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});
app.use(cors());
app.options('*', cors());
app.use(rateLimiter);

app.use(routes);
app.use(errors());
app.use(errorLogger);
app.use('', error);

app.listen(PORT, () => {
  console.log('App running on port 3000...');
});
