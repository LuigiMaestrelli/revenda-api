import request from 'supertest';
import faker from 'faker';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { truncate } from '@test/utils/database';

import app from '@/main/config/app';
import UserModel from '@/infra/db/model/user/userModel';
import UserImageModel from '@/infra/db/model/user/userImageModel';
import { generateValidUserData } from '@test/utils/user';
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';

const STRONG_PASSWORD = '^znET!St5+.PXgtZ';

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

    describe('PUT /user/id/changePassword', () => {
        test('should return 404 on put user/id/changePassword with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/changePassowrd`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(404);
        });

        test('should return 200 on put user/id/changePassword with known id and valid data', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();
            const bcryptAdapter = new BcryptAdapter();
            const hashedPassword = await bcryptAdapter.hash('xxx#$DFSads');

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: hashedPassword
            });

            const response = await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxx#$DFSads',
                    newPassword: STRONG_PASSWORD,
                    newPasswordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(200);
        });

        test('should return 500 on put user/id/changePassword with invalid id', async () => {
            const userData = await generateValidUserData();

            const response = await request(app)
                .put('/api/user/xxxxxx-xxxxx-xxxxx/changePassword')
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxxxxx',
                    newPassword: STRONG_PASSWORD,
                    newPasswordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(500);
        });

        test('should return 401 on put user/id/changePassword without valid token', async () => {
            const id = uuidv4();
            const response = await request(app).put(`/api/user/${id}/changePassword`).send();

            expect(response.status).toBe(401);
        });

        test('should return 400 on user/id/changePassword if no currentPassword is provided', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    newPassword: STRONG_PASSWORD,
                    newPasswordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
        });

        test('should return 400 on user/id/changePassword if no newPassword is provided', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxxxxx',
                    newPasswordConfirmation: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
        });

        test('should return 400 on user/id/changePassword if no newPasswordConfirmation is provided', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxxxxx',
                    newPassword: STRONG_PASSWORD
                });

            expect(response.status).toBe(400);
        });

        test('should return 400 on user/id/changePassword if newPassword and newPasswordConfirmation does not match', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxxxxx',
                    newPassword: 'asdasd 2389048e',
                    newPasswordConfirmation: 'asdasdrerwer048e'
                });

            expect(response.status).toBe(400);
        });

        test('should save new hashed password on put user/id/changePassword', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();
            const bcryptAdapter = new BcryptAdapter();
            const hashedPassword = await bcryptAdapter.hash('xxx#$DFSads');

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: hashedPassword
            });

            await request(app)
                .put(`/api/user/${id}/changePassword`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send({
                    currentPassword: 'xxx#$DFSads',
                    newPassword: STRONG_PASSWORD,
                    newPasswordConfirmation: STRONG_PASSWORD
                });

            const userUpdated = await UserModel.findByPk(id);
            const isValid = await bcryptAdapter.compare(STRONG_PASSWORD, userUpdated.password);
            expect(isValid).toBe(true);
        });
    });

    describe('PUT /user/id/image', () => {
        test('should return 404 on put user/id/image with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();
            const image = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .attach('image', image);

            expect(response.status).toBe(404);
        });

        test('should return 401 on put user/id/image without valid token', async () => {
            const id = uuidv4();

            const response = await request(app).put(`/api/user/${id}/image`).send();

            expect(response.status).toBe(401);
        });

        test('should return 200 on put user/id/image with known id and valid image', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const image = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .attach('image', image);

            expect(response.status).toBe(200);
        });

        test('should return 400 on put user/id/image with no image', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .send();

            expect(response.status).toBe(400);
        });

        test('should return 400 on put user/id/image with known id and invalid field', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const image = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .attach('imagem', image);

            expect(response.status).toBe(400);
        });

        test('should return 400 on put user/id/image with invalid file', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const textFile = path.join(__dirname, '../../../utils/testFiles/TXT_File.txt');

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .attach('image', textFile);

            expect(response.status).toBe(400);
        });

        test('should return 400 on put user/id/image with invalid file size', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id: id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const textFile = path.join(__dirname, '../../../utils/testFiles/JPG_File_30mb.jpg');

            const response = await request(app)
                .put(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`)
                .attach('image', textFile);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /user/id/image', () => {
        test('should return 404 on get user/id/image with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .get(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`);

            expect(response.status).toBe(404);
        });

        test('should return 401 on get user/id/image without valid token', async () => {
            const id = uuidv4();

            const response = await request(app).get(`/api/user/${id}/image`).send();

            expect(response.status).toBe(401);
        });

        test('should return 200 on get user/id/image with known id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const imageDir = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');
            const imageBuffer = fs.readFileSync(imageDir);

            await UserImageModel.create({
                id,
                image: imageBuffer,
                imageSize: 100,
                mimetype: 'image/png',
                miniature: imageBuffer,
                miniatureSize: 100,
                name: 'image.png'
            });

            const response = await request(app)
                .get(`/api/user/${id}/image`)
                .set('authorization', `Bearer ${userData.auth.token}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET /user/id/miniature', () => {
        test('should return 404 on get user/id/miniature with unknown id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            const response = await request(app)
                .get(`/api/user/${id}/miniature`)
                .set('authorization', `Bearer ${userData.auth.token}`);

            expect(response.status).toBe(404);
        });

        test('should return 401 on get user/id/miniature without valid token', async () => {
            const id = uuidv4();

            const response = await request(app).get(`/api/user/${id}/miniature`).send();

            expect(response.status).toBe(401);
        });

        test('should return 200 on get user/id/miniature with known id', async () => {
            const userData = await generateValidUserData();
            const id = uuidv4();

            await UserModel.create({
                id,
                name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                email: faker.internet.email(),
                password: 'xxxxx'
            });

            const imageDir = path.join(__dirname, '../../../utils/testFiles/PNG_File.png');
            const imageBuffer = fs.readFileSync(imageDir);

            await UserImageModel.create({
                id,
                image: imageBuffer,
                imageSize: 100,
                mimetype: 'image/png',
                miniature: imageBuffer,
                miniatureSize: 100,
                name: 'image.png'
            });

            const response = await request(app)
                .get(`/api/user/${id}/miniature`)
                .set('authorization', `Bearer ${userData.auth.token}`);

            expect(response.status).toBe(200);
        });
    });
});
