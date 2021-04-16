import request from 'supertest';
import app from '@/main/config/app';

describe('BodyParser Middleware', () => {
    test('should parse body as json', async () => {
        app.post('/testBodyParser', (req, res) => {
            res.send(req.body);
        });

        await request(app)
            .post('/testBodyParser')
            .send({
                name: 'any name'
            })
            .expect({ name: 'any name' });
    });
});
