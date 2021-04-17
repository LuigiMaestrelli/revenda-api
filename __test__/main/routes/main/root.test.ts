import request from 'supertest';
import app from '@/main/config/app';

describe('Root Routes', () => {
    test('should return 200', async () => {
        await request(app).get('/api').send().expect(200);
    });
});
