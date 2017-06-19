let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

module.exports.run = (server) => {
  let token = null;
  let inserted = null;
  let first = null;
  let valid = {
    "name": "Test's Barber",
    "email": "sistemahair-teste@mailinator.com",
    "phone": "(99) 99999-9999",
    "sponsorName": "Test Sponsor",
    "password": "123456@"
  };

  let unique = {
    "name": "Test's Barber 2",
    "email": "sistemahair-teste@mailinator.com",
    "phone": "(99) 99999-9999",
    "sponsorName": "Test Sponsor 2",
    "password": "123456@"
  };

  let invalid = {
    "password": "123456@"
  };

  let update = {
    "name": "Test's Barber",
    "email": "sistemahair-teste@mailinator.com",
    "phone": "(99) 99999-9999",
    "sponsorName": "Test Sponsor Name",
    "password": "123456@"
  };
  describe('Empresa', () => {
    describe('PUBLIC METHODS', () => {
      describe('Inserir empresa e usuario [/POST]', () => {
        it('Deve receber erro 400 por falta de campos obrigatorios', (done) =>{
          chai.request(server).post('/organization').set('X-Application', 'hair')
            .send(invalid)
            .end((err, res) => {
              expect(res.status).eq(400);
              done();
            });
        });
        it('Deve ser inserido com sucesso', (done) =>{
          chai.request(server).post('/organization').set('X-Application', 'hair')
            .send(valid)
            .end((err, res) => {
              expect(res.status).eq(201)
              expect(res.body.name).eq(valid.sponsorName)
              inserted = res.body
              done()
          });
        });
        it('Deve receber erro 400 por quebra de unicidade', (done) =>{
          chai.request(server).post('/organization').set('X-Application', 'hair')
            .send(unique)
            .end((err, res) => {
              expect(res.status).eq(400);
              done();
          });
        }); 
      });
    });

    describe('PRIVATE METHODS', () => {
      before('Dado que eu estou logado com um usuário válido', (done) => {
          chai.request(server).post('/auth').set('X-Application', 'hair').send(valid).end((err, res) => {
            expect(res.status).eq(200)
            expect(res.body).to.have.property('token')
            token = 'Bearer ' + res.body.token
            done()
          })
      })
      describe('Listando Empresas [/GET]', () => {
        it('Deve receber erro 401 ao acessar sem token', (done) => {
          chai.request(server).get('/organization').set('X-Application', 'hair').end((err, res) => {
            expect(res.status).eq(401);
            done();
          });
        });
        it('Deve receber com sucesso uma lista com 1 empresa', (done) => {
          chai.request(server).get('/organization').set('X-Application', 'hair').set('Authorization', token).end((err, res) => {
            expect(res.status).eq(200);
            expect(res.body).a('array').and.length(1);
            first = res.body[0];
            done();
          });
        });  
        it('Deve retornar 500 quando buscar por conta com id invalido', (done) => {
          chai.request(server).get('/organization/a').set('X-Application', 'hair').set('Authorization', token).end((err, res) => {
            expect(res.status).eq(500);
            done();
          });
        });
        it('Deve retornar com sucesso a primeira empresa', (done) => {
          chai.request(server).get('/organization/' + first._id).set('X-Application', 'hair').set('Authorization', token).end((err, res) => {
            expect(res.status).eq(200);
            done();
          });
        });
      })
      describe('Atualizando empresas [/PUT]', () => {   
        it('Deve ser atualizado com sucesso', (done) => {
          chai.request(server).put('/organization/' + inserted.organization).set('X-Application', 'hair')
            .send(update)
            .set('Authorization', token).end((err, res) => {
              expect(res.status).eq(200);
              expect(res.body.nModified).eq(1);
              done();
          });
        });
      });
    });
  });
};