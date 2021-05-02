import { truncate } from '@test/utils/database';
import request from 'supertest';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import app from '@/main/config/app';
import UserModel from '@/infra/db/model/user/userModel';
import { generateValidUserData } from '@test/utils/user';

describe('User Routes', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('GET /user/id', () => {
        test('should return 404 on get user/id with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .get(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on get user/id with known id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .get(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(id);
        });

        test('should return 500 on get user/id with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .get('/api/user/xxxxxx-xxxxx-xxxxx')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();
            expect(response.status).toBe(500);
        });

        test('should return 401 on get user/id without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).get(`/api/user/${id}`).send();

            expect(response.status).toBe(401);
        });
    });
});
