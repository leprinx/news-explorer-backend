const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Authorization is required!!' });
  }
  const token = authorization.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'test-string');
  } catch (err) {
    return res.status(401).send({ message: 'A problem with the token occured' });
  }
  req.user = payload;
  return next();
};
