const Router = require('express').Router;
const router = new Router();

const application  = require('./model/application/application-router');
const context  = require('./model/context/context-router');
const user  = require('./model/user/user-router');
const organization  = require('./model/organization/organization-router');

router.route('/').get((req, res) => {
  res.json({
    message: 'Welcome to Ship7 Software Auth API!',
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    description: process.env.npm_package_description
  });
});

router.use('/application', application);
router.use('/context', context);
router.use('/user', user);
router.use('/organization', organization);


module.exports = router;
