let chai = require('chai');
let chaiHttp = require('chai-http');
let server = ('http://localhost:3000');

chai.use(chaiHttp);
var should = require('chai').should()
var expect = require('chai').expect
var agent = chai.request.agent(server)

describe('/GET Hello World', () => {
    it('Hello world from root of server.js', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                console.log(res.body);
                expect(res.body.msg)
                    .to.equal('Hello World!');
                res.should.have.status(200);
                should.not.exist(err);
                done();
            });
    });
});

//Route Items
describe('/GET items', () => {
    it('item route test, get item by id 1', (done) => {
        chai.request(server)
            .get('/items')
            .send({
                iditem: 1
            })
            .end((err, res) => {
                console.log(res.body[0].iditem);
                expect(res.body[0].iditem)
                    .to.equal(1);
                res.should.have.status(200);
                should.not.exist(err);
                done();
            });
    });
});

describe('/GET items', () => {
    it('item route test, get item by id 0, Iditem starts at 1', (done) => {
        chai.request(server)
            .get('/items')
            .send({
                iditem: 0
            })
            .end((err, res) => {
                res.should.have.status(400);
                should.not.exist(err);
                done();
            });
    });
});
//Missing POST ITEMS





// Route Login


describe('/GET login', () => {
    it('Test login root path', (done) => {
        chai.request(server)
            .get('/login')
            .end((err, res) => {
                console.log(res.body.msg);
                expect(res.body.msg)
                    .to.equal('Here be token giving use post');
                res.should.have.status(201);
                should.not.exist(err);
                done();
            });
    });
});
describe('/POST login', () => {
    it('Try to log in', (done) => {
        chai.request(server)
            .post('/login')
            .auth('test@1.com', 123456)
            .end((err, res) => {
                console.log(res.body);
                expect(res.body)
                    .have.key('token')
                res.should.have.status(200);
                should.not.exist(err);
                done();
            });
    });
});

//Getting a token and the getting user data with that token
describe('/POST login', () => {
    it('Try to log in', (done) => {
        agent
            .post('/login')
            .auth('test@1.com', 123456)
            .end((err,res) =>{
                should.not.exist(err);
                res.should.have.status(200)
                agent.token=res.body.token
                agent.get('/users')
                .set('authorization', 'Bearer ' + agent.token)
                .end((err,res) =>{
                    should.not.exist(err);
                    console.log(res.body);
                    expect(res.body[0].email)
                    .to.equal('test@1.com');
                    res.should.have.status(200);   
                    done(); 
                });               
            });
    });
});


//ROUTE REGISTER HERE?