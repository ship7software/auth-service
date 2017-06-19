let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

module.exports.run = (server, auth) => {
  describe('Applications Middleware', () => {
    it('Deve receber erro 403 ao acessar sem aplicação', (done) => {
      chai.request(server).post('/auth').end((err, res) => {
        expect(res.status).eq(403);
        done();
      });
    });
    it('Deve receber erro 403 ao acessar com aplicação inválida', (done) => {
      chai.request(server).post('/auth').set('x-application', 'invalid').end((err, res) => {
        expect(res.status).eq(403);
        done();
      });
    });
    it('Deve receber status 200 ao acessar com aplicação válida no header', (done) => {
      chai.request(server).post('/auth').set('x-application', 'hair').send(auth).end((err, res) => {
        expect(res.status).eq(200);
        done();
      });
    });
    it('Deve receber status 200 ao acessar com aplicação válida no body', (done) => {
      let authApp = {
        email: auth.email,
        password: auth.password,
        x_application: 'hair'
      }

      chai.request(server).post('/auth').set('x-application', 'hair').send(authApp).end((err, res) => {
        expect(res.status).eq(200);
        done();
      });
    });
    it('Deve receber status 200 ao acessar com aplicação válida na query', (done) => {
      chai.request(server).post('/auth?x_application=hair').send(auth).end((err, res) => {
        expect(res.status).eq(200);
        done();
      });
    });
  });
};