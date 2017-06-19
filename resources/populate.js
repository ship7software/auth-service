process.env.NODE_ENV = process.env.NODE_ENV || 'local';
require('../index');
const path          = require('path');
const mongoose      = require('mongoose');
const fs            = require('fs');
let requiredFiles = fs.readdirSync(path.resolve(__dirname, '../resources/mongodb/required'));
for (let idx = 0; idx < requiredFiles.length; idx++) {
  requiredFiles[idx] = 'required/' + requiredFiles[idx]
}

const envResourcePath = path.resolve(__dirname, '../resources/mongodb/', process.env.NODE_ENV);

if(fs.existsSync(envResourcePath)) {
  const envFiles    = fs.readdirSync(envResourcePath);
  for (let idx = 0; idx < envFiles.length; idx++) {
    envFiles[idx] = process.env.NODE_ENV + '/' + envFiles[idx]
  }
  requiredFiles = requiredFiles.concat(envFiles);
}

let db = {};
let models = [];
for (let i = 0; i < requiredFiles.length; i += 1) {
  const file = requiredFiles[i];
  let modelName = file.replace('.json', '');
  if (modelName.indexOf('/') > -1) {
    modelName = modelName.split('/')[1];
  }

  const fileContent = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../resources/mongodb/${file}`)));
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
    db[models[idx]].model.Schema.remove({}).exec().then(() => {
      db[models[idx]].model.Schema.insertMany(db[models[idx]].content).then(() => load(nextIdx, cb));
    });
  }
}

load(0, () => {
  process.exit(0);
})