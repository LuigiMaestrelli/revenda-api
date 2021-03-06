import request from 'supertest';
import app from '@/main/config/app';

describe('CORS Middleware', () => {
    test('should enable CORS', async () => {
        app.get('/testCORS', (req, res) => {
            res.send();
        });

        await request(app).get('/testCORS').expect('access-control-allow-origin', '*');
    });
});
