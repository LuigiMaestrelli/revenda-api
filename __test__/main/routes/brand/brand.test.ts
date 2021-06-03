import request from 'supertest';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import { truncate } from '@test/utils/database';
import { generateValidUserData } from '@test/utils/user';

import app from '@/main/config/app';
import BrandModel from '@/infra/db/model/brand/brandModel';

describe('Brand Routes', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('POST /brand', () => {
        test('should return 200 on signup', async () => {
            const userData = await generateValidUserData();
            const response = await request(app)
                .post('/api/brand')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: faker.random.alpha({ count: 30 })
                });

            expect(response.status).toBe(200);
        });

        test('should return 400 on signup if no description is provided', async () => {
            const userData = await generateValidUserData();
            const response = await request(app)
                .post('/api/brand')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: null
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing param: description');
        });

        test('should return 400 on signup if invalid description is provided', async () => {
            const userData = await generateValidUserData();
            const response = await request(app)
                .post('/api/brand')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: faker.random.alpha({ count: 201 })
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(
                'Validation error: Brand`s description cannot be bigger than 200 characters'
            );
        });

        test('should return 401 on post brand without valid token', async () => {
            const response = await request(app).post('/api/brand').send();

            expect(response.status).toBe(401);
        });
    });

    describe('GET /brand/id', () => {
        test('should return 404 on get brand/id with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .get(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on get brand/id with known id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();
            const description = faker.random.alpha({ count: 30 });

            await BrandModel.create({
                id,
                description
            });

            const response = await request(app)
                .get(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(id);
            expect(response.body.description).toBe(description);
        });

        test('should return 500 on get brand/id with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .get('/api/brand/xxxxxx-xxxxx-xxxxx')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();
            expect(response.status).toBe(500);
        });

        test('should return 401 on get brand/id without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).get(`/api/brand/${id}`).send();

            expect(response.status).toBe(401);
        });
    });

    describe('PUT brand/id', () => {
        test('should return 404 on put brand/id with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'new name'
                });

            expect(response.status).toBe(404);
        });

        test('should return 200 on put brand/id with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .put(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'new description'
                });

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(id);
            expect(response.body.description).toBe('new description');
        });

        test('should return 500 on put brand/id with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/brand/xxxxxx-xxxxx-xxxxx')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'description'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put brand/id without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/brand/${id}`).send();

            expect(response.status).toBe(401);
        });

        test('should not update active on PUT brand/id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .put(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'new description',
                    active: false
                });

            const updatedBrand = await BrandModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedBrand.active).toBe(true);
            expect(updatedBrand.description).toBe('new description');
        });
    });

    describe('PUT brand/id/active', () => {
        test('should return 404 on put brand/id/active with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/brand/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on put brand/id/active with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .put(`/api/brand/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
        });

        test('should return 500 on put brand/id/active with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/brand/xxxxxx-xxxxx-xxxxx/active')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'description'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put brand/id/active without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/brand/${id}/active`).send();

            expect(response.status).toBe(401);
        });

        test('should update active prop on PUT brand/id/active', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const userBrand = await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            await userBrand.update({ active: false });

            const response = await request(app)
                .put(`/api/brand/${id}/active`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            const updatedBrand = await BrandModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedBrand.active).toBe(true);
        });
    });

    describe('PUT /brand/id/inactive', () => {
        test('should return 404 on put brand/id/inactive with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/brand/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on put brand/id/inactive with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .put(`/api/brand/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
        });

        test('should return 500 on put brand/id/inactive with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/brand/xxxxxx-xxxxx-xxxxx/inactive')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    description: 'description'
                });
            expect(response.status).toBe(500);
        });

        test('should return 401 on put brand/id/inactive without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/brand/${id}/inactive`).send();

            expect(response.status).toBe(401);
        });

        test('should update inactive prop on PUT brand/id/inactive', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .put(`/api/brand/${id}/inactive`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            const updatedBrand = await BrandModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedBrand.active).toBe(false);
        });
    });

    describe('DELETE /brand/id', () => {
        test('should return 404 on delete brand/id with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .delete(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on delete brand/id with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .delete(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(200);
        });

        test('should return 500 on delete brand/id with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .delete('/api/brand/xxxxxx-xxxxx-xxxxx')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(500);
        });

        test('should return 401 on delete brand/id without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).delete(`/api/brand/${id}`).send();

            expect(response.status).toBe(401);
        });

        test('should not find brand after delete brand/id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await BrandModel.create({
                id,
                description: faker.random.alpha({ count: 30 })
            });

            const response = await request(app)
                .delete(`/api/brand/${id}`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            const updatedBrand = await BrandModel.findByPk(id);

            expect(response.status).toBe(200);
            expect(updatedBrand).toBeFalsy();
        });
    });
});
