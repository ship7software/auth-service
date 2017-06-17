process.env.NODE_ENV = process.env.NODE_ENV || 'local';
require('../index');
const path          = require('path');
const mongoose      = require('mongoose');
const fs            = require('fs');
let requiredFiles = fs.readdirSync(path.resolve(__dirname, '../resources/mongodb/required'));
const envResourcePath = path.resolve(__dirname, '../resources/mongodb/', process.env.NODE_ENV);

if(fs.existsSync(envResourcePath)) {
  const envFiles    = fs.readdirSync(envResourcePath);
  requiredFiles = requiredFiles.concat(envFiles);
}

console.log('Environment: ' + process.env.NODE_ENV);
//mongoose.set('debug', true)
let db = {};
let models = [];
for (let i = 0; i < requiredFiles.length; i += 1) {
  const file = requiredFiles[i];
  const modelName = file.replace('.json', '');
  const fileContent = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../resources/mongodb/required/${file}`)));
  if (db[modelName]) {
    db[modelName].content = db[modelName].content.concat(fileContent);
  } else {
    models.push(modelName);
    const model = require('./../model/' + modelName + '/' + modelName + '-facade')
    db[modelName] = {
      content: fileContent,
      model: model
    };
  }
}

function load(idx, cb) {
  if (idx >= models.length) {
    cb();
  } else {
    const nextIdx = idx + 1;
    db[models[idx]].model.bulkRemove().then(() => {
      db[models[idx]].model.bulkInsert(db[models[idx]].content).then(() => load(nextIdx, cb));
    });
  }
}

load(0, () => {
  process.exit(0);
})