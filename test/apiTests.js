const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const chaiJsonSchemaAjv = require('chai-json-schema-ajv');
chai.use(chaiJsonSchemaAjv);
const serverAddress = "http://localhost:3000";

const productarray = require('../routes/schema/productarray.json') 
const userarray = require('../routes/schema/userarray.json')

describe('Api tests', function(){

    before(function(){
        server.start();
    });

    after(function(){
        server.close();
    })

    describe('GET /products', function(){
        it('should return all product data', function(done){
            chai.request(serverAddress)
            .get('/products')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                expect(res.body).to.be.jsonSchema(productarray)

                done();
            })

        })
    })

    describe('add product', function(){
        it('should accept product when data is correct', function(done){
            chai.request(serverAddress)
            .post('/products')
            .send({
                id: "123aaaa",
                title: "Electric guitar",
                description: "Pink semi-acoustic electric guitar, very good condition",
                userCategory: "music",
                location: "Kiiminki",
                image1: null,
                image2: null,
                image3: null,
                image4: null,
                askingPrice: 115,
                dateOfPosting: "2021-12-24",
                deliveryType: 2, 
                sellersName: "Ville",
                sellersContact: 5672134
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            })
        })
        it('should reject request when there is missing fields', function(done) {
            chai.request(serverAddress)
            .post('/products')
            .send({
                id: "123",
                title: "Electric guitar",
                description: "Pink semi-acoustic electric guitar, very good condition",
                userCategory: "music",
                location: "Kiiminki",
                image1: null,
                image2: null,
                image3: null,
                image4: null,
                askingPrice: 115,
                deliveryType: 2, 
                sellersName: "Ville",
                sellersContact: 5672134
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })
        it('should reject request with incorrect data types', function(done){
            chai.request(serverAddress)
            .post('/products')
            .send({
                id: "123",
                title: "Guitar",
                description: "wooden",
                userCategory: "music",
                location: "555",
                image1: null,
                image2: null,
                image3: null,
                image4: null,
                askingPrice: 20,
                deliveryType: 2, 
                sellersName: "Ville",
                sellersContact: 1255
            })
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
            })
        })
        it('should reject empty post', function(done){
            chai.request(serverAddress)
            .post('/products')
            .end(function(err, res){
                expect(err).to.be.null;
                expect(res).to.have.status(400);
                done();
        })
    })

    describe('add user', function(){
    it('should accept user when data is correct', function(done){
        chai.request(serverAddress)
        .post('/users')
        .send({
            
                id: "",
                firstName: "Mira",
                lastName: "Heinola",
                email: "mira.hei@gmail.com",
                dateOfBirth: "1988-08-25",
                emailVerified: true,
                signUpDate: "2020-01-28"
})
        .end(function(err, res){
         expect(err).to.be.null;
         expect(res).to.have.status(400);
        done();
})
    })
    it('should reject empty post', function(done){
    chai.request(serverAddress)
    .post('/users')
    .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
})
})
    it('should reject request with incorrect data types', function(done){
    chai.request(serverAddress)
    .post('/users')
    .send({
        id: "12lls55",
        firstName: "Mira",
        lastName: "Heinola",
        email: "mira.hei@gmail.com",
        dateOfBirth: "1988-08-25",
        emailVerified: true,
        signUpDate: "hello"
    })
    .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
    })
})
it('should reject request when there is missing fields', function(done){
    chai.request(serverAddress)
    .post('/users')
    .send({
        id: "12lls55",
        firstName: "Mira",
        lastName: "Heinola",
        email: "mira.hei@gmail.com",
        dateOfBirth: "1988-08-25",
        emailVerified: true,

    })
    .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        done();
        })
    })
    })
    })
    })
