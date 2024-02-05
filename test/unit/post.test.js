const request = require('supertest');
const app = require('../../src/app');

describe('POST /fragments',()=>{
    test("When user properly authed, post should be successfully created",()=>{
        const payLoad ={
            body:"This is a test"
        };
        request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1') 
        .send(payLoad)
        .expect(201)
    })

    test("When user properly authed, post should be successfully created",()=>{
        const payLoad ={
            body:"This will fail"
        };
        request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1') 
        .send(payLoad)
        .expect(415)
    })

})
