const Router = require('express').Router;
const router = new Router();

module.exports.rest = (controller) => {
  router.route('/')
    .get((...args) => controller.find(...args))
    .post((...args) => controller.create(...args));

  router.route('/:id')
    .put((...args) => controller.update(...args))
    .get((...args) => controller.findById(...args))
    .delete((...args) => controller.remove(...args));

  return router;
};