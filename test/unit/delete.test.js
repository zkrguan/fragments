const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id Modify each elements after persist', () => {
    let objectId = [];
    // Create the object using POST before any test in this suite
    beforeAll(async () => {
        for (let i = 0; i < 5; i++) {
            const payload = Buffer.from('This is test object number ' + (i + 1));
            const response = await request(app)
                .post('/v1/fragments')
                .auth('user1@email.com', 'password1')
                .set('Content-Type', 'text/plain')
                .send(payload)
                .expect(201);
            objectId.push(response.body.fragment.id);
        }
    });

    test('Modify each object using DELETE', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            await request(app)
                .delete(`/v1/fragments/${objectId[i]}`)
                .auth('user1@email.com', 'password1')
                .set('Content-Type', 'text/plain')
                .send(Buffer.from('Modified'))
                .expect(200);
        }
    });

    test('Get Modified Results', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/${objectId[i]}`)
                .auth('user1@email.com', 'password1')
                .expect(404);
        }
    });

    test('Delete twice on the same ID', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            await request(app)
                .delete(`/v1/fragments/${objectId[i]}`)
                .auth('user1@email.com', 'password1')
                .set('Content-Type', 'text/plain')
                .send(Buffer.from('Modified'))
                .expect(404);
        }
    });
});
