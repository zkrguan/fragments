const request = require('supertest');
const app = require('../../src/app');

describe('POST /fragments', () => {
    test('When user properly authed, post should be successfully created', async () => {
        const payload = Buffer.from('This is a test');
        await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .send(payload)
            .expect(201);
    });

    test('This should fail because of the unsupported type', async () => {
        const payload = Buffer.from('This is a test');
        await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/css')
            .send(payload)
            .expect(415);
    });

    test('This should fail because of there is missing content header', async () => {
        await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .send()
            .expect(500);
    });

    test('This should fail because of there is missing payload', async () => {
        await request(app)
            .post('/v1/fragments')
            .auth('user1@email.com', 'password1')
            .set('Content-Type', 'text/plain')
            .expect(400);
    });
});
