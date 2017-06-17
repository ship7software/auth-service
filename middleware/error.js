module.exports = (err, req, res, next) => {
  if (err.errors) {
    res.status(400).json(err.errors);
  } else if (err.name && err.name === 'MongoError') {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
  if (process.env.NODE_ENV !== 'test') {
    console.log(err);
  }
};
