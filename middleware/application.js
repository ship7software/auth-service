const applicationFacade = require('./../model/application/application-facade');

function sanitizeReq(req) {
  if (req.query.x_application) {
    delete req.query.x_application;
  }

  if (req.body.x_application) {
    delete req.body.x_application;
  }
}
module.exports = (req, res, next) => {
  if (req.url !== '/' && req.url.indexOf('/context') === -1 && req.url.indexOf('/application') === -1) {
    const appShortName = req.headers['x-application'] || req.query.x_application || req.body.x_application;

    sanitizeReq(req);

    if (!appShortName) {
      res.status(403).send({ code: 'INVALID_APPLICATION' });
    } else {
      applicationFacade.findOne({ shortName: appShortName }).then((app) => {
        if (!app) {
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
