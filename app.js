const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const error = require('./middlewares/error');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/news-explorer', {
  useNewUrlParser: true,
});
app.use(express.json());

app.use(routes);
app.use(errors());
app.use('', error);

app.listen(PORT, () => {
  console.log('App running on port 3000...');
});
