function getStatusCode(err) {
  if (err.errors || err.name === 'MongoError') {
    return 400;
  }
  return 500;
}

function getContent(err) {
  if (err.errors) {
    return err.errors;
  }
  return { message: err.message };
}

module.exports = (err, req, res, next) => {
  res.status(getStatusCode(err)).send(getContent(err));

  if (process.env.NODE_ENV !== 'test') {
    console.log(err);
  }
};
