const mongoose = require('mongoose');

const validateUrl = (email) => {
  const re = /(^(http|https):\/\/(www\.)?[a-z0-9-.]+\.\w{2,3}(\/[a-z0-9-_.~:(/?%#[\]@!$&'()*+,;=]*)*(\/|#)?)/i;
  return re.test(email);
};

const newsSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validateUrl, 'Please fill a valid url'],
    match: [
      /(^(http|https):\/\/(www\.)?[a-z0-9-.]+\.\w{2,3}(\/[a-z0-9-_.~:(/?%#[\]@!$&'()*+,;=]*)*(\/|#)?)/i,
      'Please fill a valid url',
    ],
  },
  image: {
    type: String,
    required: true,
    validate: [validateUrl, 'Please fill a valid url'],
    match: [
      /(^(http|https):\/\/(www\.)?[a-z0-9-.]+\.\w{2,3}(\/[a-z0-9-_.~:(/?%#[\]@!$&'()*+,;=]*)*(\/|#)?)/i,
      'Please fill a valid url',
    ],
  },
  owner: {
    type: String,
    required: true,
    select: false,
  },
});

newsSchema.statics.deleteNews = function deleteNews(id) {
  return this.findById(id).select('+owner');
};

module.exports = mongoose.model('news', newsSchema);
