const fs = require('fs')
const arquivos = fs.readdirSync(__dirname)
const configurations = [];

for (let idx = 0; idx < arquivos.length; idx++) {
  const element = arquivos[idx]
  if(element.indexOf('.json') > -1){
    configurations.push(JSON.parse(fs.readFileSync(__dirname + '/' + element, 'utf8')))
  }
}

module.exports = configurations