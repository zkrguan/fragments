// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments Auth Check', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () =>
        request(app).get('/v1/fragments').expect(401));

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
        request(app)
            .get('/v1/fragments')
            .auth('invalid@email.com', 'incorrect_password')
            .expect(401));

    // Using a valid username/password pair should give a success result with a .fragments array
    test('authenticated users get a fragments array', async () => {
        const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(Array.isArray(res.body.fragments)).toBe(true);
    });
});

describe('GET /v1/fragments/:id retrieve individual after persisting', () => {
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

    test('Retrieve object using GET', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}`)
                .auth('user1@email.com', 'password1')
                .expect(200);
            const text = res.text;
            expect(text).toEqual('This is test object number ' + (i + 1));
        }
    });

    test('Using Wrong ID and get 404 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/aFunnyID`)
                .auth('user1@email.com', 'password1')
                .expect(404);
        }
    });
});

describe('GET /v1/fragments/?expands=1 retrieve a list', () => {
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

    test('If the length matched with posted length', async () => {
        const res = await request(app)
            .get(`/v1/fragments/?expand=1`)
            .auth('user1@email.com', 'password1')
            .expect(200);
        // YOU CANNOT TRUST THE SEQUENCE BECAUSE DICT USED FOR MEMORY DB
        // DATA STRUCTURE 101=> THERE IS NO SEQUENCE IN HASH MAP.
        for (let i = 0; i < 5; i++) {
            expect(
                res.body.fragments.find((ele) => {
                    return ele.id === objectId[i];
                }).id
            ).toEqual(objectId[i]);
        }
    });
});

describe('GET /v1/fragments/:id retrieve individual ', () => {
    let objectId = [];
    // Create the object using POST before any test in this suite
    beforeAll(async () => {
        for (let i = 0; i < 5; i++) {
            const payload = Buffer.from('# This is test object number ' + (i + 1));
            const response = await request(app)
                .post('/v1/fragments')
                .auth('user1@email.com', 'password1')
                .set('content-type', 'text/markdown; charset=utf-8')
                .send(payload)
                .expect(201);
            objectId.push(response.body.fragment.id);
        }
    });

    test('Retrieve object using GET', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.txt`)
                .auth('user1@email.com', 'password1')
                .expect(200);
            const text = res.text;
            expect(text).toEqual('# This is test object number ' + (i + 1));
            const contentType = res.headers['content-type'];
            expect(contentType).toEqual('text/plain; charset=utf-8');
        }
    });

    test('Using Wrong ID and get 404 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/aFunnyID`)
                .auth('user1@email.com', 'password1')
                .expect(404);
        }
    });

    test('Using unsupported type and get 415 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/${objectId[i]}.mp4`)
                .auth('user1@email.com', 'password1')
                .expect(415);
        }
    });
});

describe('GET /v1/fragments/:id retrieve individual json => text', () => {
    let objectId = [];
    // Create the object using POST persist 5 object using md
    beforeAll(async () => {
        for (let i = 0; i < 5; i++) {
            const payload = Buffer.from(`{ id: ${i + 1} }`);
            const response = await request(app)
                .post('/v1/fragments')
                .auth('user1@email.com', 'password1')
                .set('content-type', 'application/json; charset=utf-8')
                .send(payload)
                .expect(201);
            objectId.push(response.body.fragment.id);
        }
    });

    test('Retrieve object using GET', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}.txt`)
                .auth('user1@email.com', 'password1')
                .expect(200);
            const dataString = Buffer.from(JSON.parse(res.text).data).toString();
            expect(dataString).toEqual(`{ id: ${i + 1} }`);
            // Assuming your data is JSON, parse it
            // Now you can access the data property and perform your assertions
            expect(res.headers['content-type']).toEqual('text/plain; charset=utf-8');
        }
    });

    test('Using Wrong ID and get 404 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/aFunnyID`)
                .auth('user1@email.com', 'password1')
                .expect(404);
        }
    });

    test('Using unsupported type and get 415 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/${objectId[i]}.mp4`)
                .auth('user1@email.com', 'password1')
                .expect(415);
        }
    });
});

describe('GET /v1/fragments/:id/info retrieve individual meta data', () => {
    let objectId = [];
    let objectList = [];
    // Create the object using POST before any test in this suite
    beforeAll(async () => {
        for (let i = 0; i < 5; i++) {
            const payload = Buffer.from('# This is test object number ' + (i + 1));
            const response = await request(app)
                .post('/v1/fragments')
                .auth('user1@email.com', 'password1')
                .set('content-type', 'text/markdown; charset=utf-8')
                .send(payload)
                .expect(201);
            objectId.push(response.body.fragment.id);
            objectList.push(response.body);
        }
    });

    test('Retrieve meta data using GET', async () => {
        expect(objectId).toBeDefined();
        for (let i = 0; i < 5; i++) {
            const res = await request(app)
                .get(`/v1/fragments/${objectId[i]}/info`)
                .auth('user1@email.com', 'password1')
                .expect(200);
            expect(res.body.fragment).toEqual(objectList[i].fragment);
            expect(res.status).toEqual(200);
            expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
        }
    });

    test('Using Wrong ID and get 404 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/aFunnyID/info`)
                .auth('user1@email.com', 'password1')
                .expect(404);
        }
    });

    test('Using unsupported type and get 415 back', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .get(`/v1/fragments/${objectId[i]}.mp4`)
                .auth('user1@email.com', 'password1')
                .expect(415);
        }
    });
});
