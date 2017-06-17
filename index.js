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
console.log(config);
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGO_DB_URI || config.mongo.url);
mongoose.set('debug', process.env.NODE_ENV !== 'test');

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(require('./middleware/application'));
app.use('/', routes);

app.use((err, req, res, next) => {
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
});

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;
