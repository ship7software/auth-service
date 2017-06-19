module.exports = require('./../../lib/router').rest(require('./user-controller'), (controller, router) => {
  router.route('/confirmation/send')
    .post((...args) => controller.sendConfirmation(...args));

  router.route('/confirmation')
    .post((...args) => controller.confirm(...args));

  router.route('/passwordReset/send')
    .post((...args) => controller.sendPasswordReset(...args));

  router.route('/passwordReset/verify')
    .post((...args) => controller.verifyPasswordReset(...args));

  router.route('/passwordReset')
    .post((...args) => controller.passwordReset(...args));

  return router;
});
