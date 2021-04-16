import request from 'supertest';
import app from '@/main/config/app';

describe('Compression Middleware', () => {
    test('should return default content type as json', async () => {
        app.get('/testCompression', (req, res) => {
            res.send({
                test: true,
                someData: 'Test test test test test test test test test test test',
                someOtherData: 'Test test test test test test test test test test test'
            });
        });

        await request(app)
            .get('/testCompression')
            .expect('vary', /Accept-Encoding/);
    });
});
