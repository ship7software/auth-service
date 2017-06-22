const express       = require('express');
const mongoose      = require('mongoose');
const helmet        = require('helmet');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const bluebird      = require('bluebird');
const cors          = require('cors');
const routes        = require('./routes');
const yamlConfig    = require('node-yaml-config');
const path          = require('path');
const app           = express();
const config        = yamlConfig.load(path.join(__dirname, '/config.yml'));
const Ship7Middle   = require('ship7-api-lib').Middleware;
const appFacade     = require('./model/application/application-facade');

app.set('config', config);
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGO_DB_URI || config.mongo.url);

mongoose.set('debug', process.env.NODE_ENV !== 'test');

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny', {
  skip: () => process.env.NODE_ENV === 'test'
}));
app.use(require('./middleware/application'));
const contextMiddleware = require('./middleware/context');

app.use(contextMiddleware.get);
app.use(contextMiddleware.resolve);
app.use(Ship7Middle.VerifyAuth({
  whiteList: [
    { method: '*', path: '/context' },
    { method: 'POST', path: '/organization' },
    { method: 'POST', path: '/user/confirmation' },
    { method: 'POST', path: '/user/passwordReset' },
    { method: 'POST', path: '/auth' }
  ],
  basicValidator: (req, res, next) => {
    appFacade.findOne({
      shortName: req.user.login,
      apiKey: req.user.password
    }).then((response) => {
      if (response) {
        return next();
      }
      res.status(401).json({ message: 'INVALID_OR_EXPIRED_TOKEN' });
    });
  }
}));

app.use('/', routes);
app.get('/me', Ship7Middle.Perfil);
app.use(require('./middleware/error'));

app.listen(process.env.PORT || config.server.port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Magic happens on port ${(process.env.PORT || config.server.port)}`);
  }
});

module.exports = app;
