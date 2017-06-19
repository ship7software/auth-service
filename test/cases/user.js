let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

module.exports.run = (server) => {
  let token = null;
  let confirmationToken = null;
  let first = null;
  let valid = {
    "name": "Test's Barber User 2",
    "email": "sistemahair-teste-user@mailinator.com",
    "phone": "(99) 99599-9999",
    "sponsorName": "Test Sponsor 2",
    "password": "123456@"
  };

  let passwordResetPayload = {
    password: "1234567@",
    passwordConfirm: "1234567@",
    token: null
  }
  
  describe('Usuario', () => {
    it('Deve ser inserido com sucesso', (done) =>{
      chai.request(server).post('/organization').set('X-Application', 'hair')
        .send(valid)
        .end((err, res) => {
          expect(res.status).eq(200);
          done();
      });
    });
    it('Deve enviar confirmacao e receber sucesso', (done) =>{
      chai.request(server).post('/user/confirmation/send').set('X-Application', 'hair')
        .send(valid)
        .end((err, res) => {
          expect(res.status).eq(200);
          confirmationToken = res.body.confirmationToken;
          done();
      });
    });
    it('Deve receber erro ao tentar autenticar com email valido porem senha invalida', (done) =>{
      chai.request(server).post('/auth').set('X-Application', 'hair').send({ email: valid.email })
        .end((err, res) => {
          expect(res.status).eq(401);
          done();
      });
    });
    it('Deve receber erro ao tentar confirmar com token invalido', (done) =>{
      chai.request(server).post('/user/confirmation').set('X-Application', 'hair')
        .end((err, res) => {
          expect(res.status).eq(401);
          done();
      });
    });
    it('Deve receber token autenticado ao confirmar com token valido', (done) =>{
      chai.request(server).post('/user/confirmation').send({ token: confirmationToken }).set('X-Application', 'hair')
        .send(valid)
        .end((err, res) => {
          expect(res.status).eq(200);
          done();
      });
    });
    it('Deve receber token de redefinicao com sucesso', (done) =>{
      chai.request(server).post('/user/passwordReset/send').set('X-Application', 'hair')
        .send(valid)
        .end((err, res) => {
          expect(res.status).eq(200);
          passwordResetPayload.token = res.body.passwordResetToken;
          done();
      });
    });
    it('Deve receber erro ao tentar verificar com token invalido', (done) =>{
      chai.request(server).post('/user/passwordReset/verify').set('X-Application', 'hair')
        .end((err, res) => {
          expect(res.status).eq(401);
          done();
      });
    });
    it('Deve receber sucesso ao verificar com token valido', (done) =>{
      chai.request(server).post('/user/passwordReset/verify').send({ token: passwordResetPayload.token }).set('X-Application', 'hair')
        .end((err, res) => {
          expect(res.status).eq(200);
          done();
      });
    });
    it('Deve receber erro ao tentar redefinir com token invalido', (done) =>{
      chai.request(server).post('/user/passwordReset').set('X-Application', 'hair')
        .end((err, res) => {
          expect(res.status).eq(401);
          done();
      });
    });
    it('Deve receber erro 400 tentar redefinir com dados de senha invalido', (done) =>{
      chai.request(server).post('/user/passwordReset').send({ token: passwordResetPayload.token }).set('X-Application', 'hair')
        .end((err, res) => {
          expect(res.status).eq(400);
          done();
      });
    });
    it('Deve receber token autenticado ao redefinir com token valido', (done) =>{
      chai.request(server).post('/user/passwordReset').send(passwordResetPayload).set('X-Application', 'hair')
        .send(passwordResetPayload)
        .end((err, res) => {
          expect(res.status).eq(200);
          done();
      });
    });
  });
};