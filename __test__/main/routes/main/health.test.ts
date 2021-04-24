import request from 'supertest';
import app from '@/main/config/app';

describe('Health Routes', () => {
    describe('Database Routes', () => {
        test('should return 200', async () => {
            await request(app).get('/api/health/database').send().expect(200);
        });
    });

    describe('Server Routes', () => {
        test('should return 200', async () => {
            await request(app).get('/api/health/server').send().expect(200);
        });
    });
});
