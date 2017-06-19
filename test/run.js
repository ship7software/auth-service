process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../index')
let expect = chai.expect
const restRunner = require('./lib/rest');
const restCases = require('./resources/cases');
const auth = require('./resources/auth.json');

chai.use(chaiHttp)

describe('Inicio', () => {
  describe('/GET Mensagem Bem vindo', () => {
    it('Recebo a mensagem de bem vindo do servidor', (done) => {
      chai.request(server).get('/').end((err, res) => {
        expect(res.status).eq(200);
        expect(res.body).be.a('object');
        expect(res.body).to.have.property('message').and.equal('Welcome to Ship7 Software Auth API!');
        done();
      });
    });
  });
});

require('./cases/organization').run(server);
require('./middleware/application').run(server, auth.principal);
require('./middleware/auth').run(server, auth.principal);

for (let idx = 0; idx < restCases.length; idx++) {
  restRunner(server, restCases[idx], auth.principal);
}