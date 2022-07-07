const News = require('../models/newsSchema');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SUCCES,
  CONFLICT_ERROR,
  CREATED_SUCCES,
  FORBIDDEN,
} = require('../utils/errorHandlers');
const ErrorHandler = require('../utils/errorClass');

const getUserSavedNews = (req, res, next) => {
  News.find({ owner: req.user._id })
    .then((articles) => {
      res.status(SUCCES).send({ data: articles });
    })
    .catch(next);
};

const addNews = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  News.findOne({ $and: [{ link: link }, { owner: req.user._id }] })
    .then((card) => {
      if (card) {
        throw new ErrorHandler('Article already added', CONFLICT_ERROR);
      } else {
        News.create({
          keyword,
          title,
          text,
          date,
          source,
          link,
          image,
          owner: req.user._id,
        })
          .then((article) => res.status(CREATED_SUCCES).send({ data: article }))
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
                new ErrorHandler('Unable to acces the news', NOT_FOUND),
              );
            }
            return next(err);
          });
      }
    })
    .catch((err) => res.status(500).send(err.message));
};

const deleteNews = (req, res, next) => {
  const id = req.params.articleId;
  News.deleteNews(id)
    .orFail(() => {
      throw new ErrorHandler('No card found for the specified id', NOT_FOUND);
    })
    .then((article) => {
      if (article.owner !== req.user._id) {
        throw new ErrorHandler('Not allowed to delete this article', FORBIDDEN);
      }
      News.findByIdAndDelete(article._id)
        .then((articleDeleted) => {
          res.status(SUCCES).send({ data: articleDeleted });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new ErrorHandler('Invalid articleId', BAD_REQUEST));
          }
          return next(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

module.exports = {
  getUserSavedNews,
  deleteNews,
  addNews,
};
