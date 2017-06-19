let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

module.exports.run = (server, auth) => {
  describe('Auth Middleware', () => {
    it('Deve receber erro 401 ao acessar sem token', (done) => {
      chai.request(server).get('/me?x_application=hair').end((err, res) => {
        expect(res.status).eq(401);
        done();
      });
    });
    it('Deve receber erro 401 ao acessar com token invalido', (done) => {
      chai.request(server).get('/me?x_application=hair').set('authorization', 'token invalid').end((err, res) => {
        expect(res.status).eq(401);
        done();
      });
    });
  });
};