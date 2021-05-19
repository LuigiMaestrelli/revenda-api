import { truncate } from '@test/utils/database';
import request from 'supertest';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import app from '@/main/config/app';
import UserModel from '@/infra/db/model/user/user';
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

    describe('PUT /user/id', () => {
        test('should return 404 on put user/id with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    name: 'new name'
                });

            expect(response.status).toBe(404);
        });

        test('should return 200 on put user/id with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    name: 'new name'
                });

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(id);
            expect(response.body.name).toBe('new name');
        });

        test('should return 500 on put user/id with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/user/xxxxxx-xxxxx-xxxxx')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    name: 'name'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put user/id without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/user/${id}`).send();

            expect(response.status).toBe(401);
        });

        test('should not update password on PUT user/id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    password: 'new password'
                });

            const updatedUser = await UserModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedUser.password).toBe('xxxxxxxx');
        });

        test('should not update email on PUT user/id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();
            const email = faker.internet.email();

            await UserModel.create({
                id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email,
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    email: 'new email'
                });

            const updatedUser = await UserModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedUser.email).toBe(email);
        });
    });

    describe('PUT /user/id/active', () => {
        test('should return 404 on put user/id/active with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on put user/id/active with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
        });

        test('should return 500 on put user/id/active with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/user/xxxxxx-xxxxx-xxxxx/active')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    name: 'name'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put user/id/active without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/user/${id}/active`).send();

            expect(response.status).toBe(401);
        });

        test('should update active prop on PUT user/id/active', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const userCreated = await UserModel.create({
                id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });
            await userCreated.update({ active: false });

            const response = await request(app)
                .put(`/api/user/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            const updatedUser = await UserModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedUser.active).toBe(true);
        });
    });

    describe('PUT /user/id/inactive', () => {
        test('should return 404 on put user/id/inactive with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on put user/id/inactive with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
        });

        test('should return 500 on put user/id/inactive with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/user/xxxxxx-xxxxx-xxxxx/inactive')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    name: 'name'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put user/id/inactive without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/user/${id}/inactive`).send();

            expect(response.status).toBe(401);
        });

        test('should update inactive prop on PUT user/id/inactive', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            const updatedUser = await UserModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedUser.active).toBe(false);
        });
    });
});
