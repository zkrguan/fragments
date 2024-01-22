const request = require('supertest');
const app = require('../../src/app');

describe('/ health check', () => {
    test('should return status error, code 404, message not found', async () => {
        const res = await request(app).get('/iAmNotExisted');
        console.log(res.body.error);
        expect(res.body.status).toEqual('error');
        expect(res.body.error['message']).toEqual('not found');
        expect(res.body.error['code']).toEqual(404);
    });
});
