import { truncate } from '../../../utils/database';
import request from 'supertest';
import faker from 'faker';
import app from '@/main/config/app';

const STRONG_PASSWORD = '^znET!St5+.PXgtZ';

describe('Login Routes', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('POST /signup', () => {
        test('should return 200 on signup', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    password: STRONG_PASSWORD,
                    passwordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(200);
        });

        test('should return 400 on signup if no name is provided', async () => {
            const response = await request(app).post('/api/signup').send({
                email: faker.internet.email(),
                password: STRONG_PASSWORD,
                passwordConfirmation: STRONG_PASSWORD
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing param: name');
        });

        test('should return 400 on signup if no email is provided', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    password: STRONG_PASSWORD,
                    passwordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing param: email');
        });

        test('should return 400 on signup if no password is provided', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    passwordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing param: password');
        });

        test('should return 400 on signup if no passwordConfirmation is provided', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    password: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Missing param: passwordConfirmation');
        });

        test('should return 400 on signup if password and passwordConfirmation do not match', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    password: STRONG_PASSWORD,
                    passwordConfirmation: 'other password'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid param: passwordConfirmation');
        });

        test('should return 400 on signup if an invalid e-mail is provided', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: 'test@@',
                    password: STRONG_PASSWORD,
                    passwordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid param: email');
        });

        test('should return 400 on signup if an weak password is provided', async () => {
            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: faker.internet.email(),
                    password: 'password',
                    passwordConfirmation: 'password'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid param: password is too week');
        });
    });
});
