const applicationFacade = require('./../model/application/application-facade');

module.exports = (req, res, next) => {
  if (req.url !== '/' && req.url.indexOf('/context') === -1 && req.url.indexOf('/application') === -1) {
    const appShortName = req.headers['x-application'] || req.query.application || req.body.application;
    if (!appShortName) {
      res.status(403).send({ code: 'INVALID_APPLICATION' });
    } else {
      applicationFacade.findOne({ shortName: appShortName }).then((app) => {
        if (!appShortName) {
          res.status(403).send({ code: 'INVALID_APPLICATION' });
        } else {
          req.application = app;
          next();
        }
      }).catch(err => next(err));
    }
  } else {
    next();
  }
};
