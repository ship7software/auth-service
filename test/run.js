process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./../index')
let expect = chai.expect

chai.use(chaiHttp)

describe('Inicio', () => {
  describe('/GET Mensagem Bem vindo', () => {
    it('Recebo a mensagem de bem vindo do servidor', (done) => {
      chai.request(server).get('/').end((err, res) => {
        expect(res.status).eq(200)
        expect(res.body).be.a('object')
        expect(res.body).to.have.property('message').and.equal('Welcome to Ship7 Software Auth API!')
        done()
      })
    })
  })
})