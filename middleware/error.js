function getStatusCode(err) {
  if (err.errors || err.name === 'MongoError') {
    return 400;
  }
  return 500;
}

function getPropErrorMessage(prop, pathName, collectionName) {
  if (prop.kind === 'unique') {
    return `Já existe registro com '${pathName}' igual à '${prop.value}'`;
  } else if (prop.kind === 'required') {
    return `'${pathName}' é obrigatório`;
  }
  return prop.message;
}

function resolveErrors(err) {
  const messages = [];
  let collectionName = err._message.replace(' validation failed', '');
  let business = null;
  /* eslint-disable */
  business = require(`./../model/${collectionName.toLowerCase()}/${collectionName.toLowerCase()}-business.js`);
  /* eslint-enable */

  collectionName = business.name || collectionName;
  business.properties = business.properties || {};

  for (const key in err.errors) {
    const prop = err.errors[key];
    const pathName = business.properties[prop.path] || prop.path;

    messages.push(getPropErrorMessage(prop, pathName, collectionName));
  }

  return messages;
}

function getContent(err) {
  if (err.errors) {
    return { messages: resolveErrors(err) };
  }
  return { message: err.message };
}

module.exports = (err, req, res, next) => {
  res.status(getStatusCode(err)).send(getContent(err));

  if (process.env.NODE_ENV !== 'test') {
    console.log(err);
  }
};
