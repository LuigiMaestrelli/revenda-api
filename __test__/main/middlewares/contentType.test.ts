import request from 'supertest';
import app from '@/main/config/app';

describe('Content Type Middleware', () => {
    test('should return default content type as json', async () => {
        app.get('/testContentType', (req, res) => {
            res.send();
        });

        await request(app).get('/testContentType').expect('content-type', /json/);
    });

    test('should return xml content when forced', async () => {
        app.get('/testContentTypeXML', (req, res) => {
            res.type('xml');
            res.send();
        });

        await request(app).get('/testContentTypeXML').expect('content-type', /xml/);
    });
});
