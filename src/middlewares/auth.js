module.exports = (req, res, next) => {
  console.log('sess:', req.session);
  if (req.session.user) {
    return next();
  }
  return res.json({ message: 'offline' });
};
