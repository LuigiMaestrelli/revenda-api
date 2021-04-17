import { truncate } from '../../../utils/database';
import request from 'supertest';
import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';
import app from '@/main/config/app';
import UserModel from '@/infra/db/model/user/userModel';

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

        test('should return 400 on signup if the e-mail is already in use', async () => {
            const email = faker.internet.email();

            await UserModel.create({
                id: uuidv4(),
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: email,
                password: 'xxxxxxxx'
            });

            const response = await request(app)
                .post('/api/signup')
                .send({
                    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                    email: email,
                    password: STRONG_PASSWORD,
                    passwordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid param: e-mail already in use');
        });
    });
});
