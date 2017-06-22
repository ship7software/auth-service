const contextFacade = require('./../model/context/context-facade');
function getContext(application, context, config, frontBase) {
  return {
    appName: application.name || config.appName,
    shortName: application.shortName,
    logoUrl: application.logoUrl || config.logoUrl,
    whiteLogoUrl: application.whiteLogoUrl || config.logoUrl,
    blackLogoUrl: application.blackLogoUrl || config.logoUrl,
    frontendUrlBase: frontBase,
    authPage: {
      htmlDescription: application.htmlDescription
    }
  };
}
module.exports = {

  get: (req, res, next) => {
    if (req.application) {
      const contextFilter = { appShortName: req.application.shortName, hostname: req.hostname };
      contextFacade.findOne(contextFilter).then((context) => {
        req.application.context = context;
        next();
      });
    } else {
      next();
    }
  },

  resolve: (req, res, next) => {
    const application = req.application || {};
    const context = application.context || {};
    const config = req.app.get('config');
    let frontBase = context.frontendUrlBase;
    frontBase = frontBase || application.frontendUrlBase || config.frontendUrlBase;
    req.context = getContext(application, context, config, frontBase);

    next();
  }
};
