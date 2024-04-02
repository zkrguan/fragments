const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');

describe('GET /v1/fragments/?expands=1 retrieve a list', () => {
    let objectId = [];
    // Create the object using POST before any test in this suite
    beforeAll(async () => {
        for (let i = 0; i < 5; i++) {
            const filePath = 'test/unit/sample.png';
            const payload = fs.readFileSync(filePath);
            const response = await request(app)
                .post('/v1/fragments')
                .auth('user1@email.com', 'password1')
                .set('Content-Type', 'image/png')
                .send(payload)
                .expect(201);
            objectId.push(response.body.fragment.id);
        }
    });

    test('Get the file back in the original format', async () => {
        const res = await request(app)
            .get(`/v1/fragments/?expand=1`)
            .auth('user1@email.com', 'password1')
            .expect(200);
        for (let i = 0; i < 5; i++) {
            expect(
                res.body.fragments.find((ele) => {
                    return ele.id === objectId[i];
                }).id
            ).toEqual(objectId[i]);
        }
    });

    test('Get the file back in the jpeg format', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.jpg`) // Convert markdown to HTML
                .auth('user1@email.com', 'password1')
                .expect(200);
            // Assuming the response contains HTML content
            expect(res.headers['content-type']).toMatch('image/jpeg');
        }
    });

    test('Get the file back in the png format', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.png`) // Convert markdown to HTML
                .auth('user1@email.com', 'password1')
                .expect(200);
            // Assuming the response contains HTML content
            expect(res.headers['content-type']).toMatch('image/png');
        }
    });

    test('Get the file back in the webp format', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.webp`) // Convert markdown to HTML
                .auth('user1@email.com', 'password1')
                .expect(200);
            // Assuming the response contains HTML content
            expect(res.headers['content-type']).toMatch('image/webp');
        }
    });

    test('Get the file back in the gif format', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.gif`) // Convert markdown to HTML
                .auth('user1@email.com', 'password1')
                .expect(200);
            // Assuming the response contains HTML content
            expect(res.headers['content-type']).toMatch('image/gif');
        }
    });

    test('Get the file back in the avif format', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.avif`) // Convert markdown to HTML
                .auth('user1@email.com', 'password1')
                .expect(200);
            // Assuming the response contains HTML content
            expect(res.headers['content-type']).toMatch('image/avif');
        }
    });
});
