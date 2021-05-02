import request from 'supertest';
import app from '@/main/config/app';
import { makeAuthenticationMiddleware } from '@/main/factories/middleware/authenticationFactory';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';
import config from '@/main/config';

describe('Authentication Middleware', () => {
    test('should return 401 if no token is provided', async () => {
        const middleware = makeAuthenticationMiddleware();

        app.post('/testAuthenticationNoToken', middleware, (req, res) => {
            res.send(req.body);
        });

        const response = await request(app).post('/testAuthenticationNoToken').send({});
        expect(response.status).toBe(401);
    });

    test('should return 401 if invalid token bearer is provided', async () => {
        const middleware = makeAuthenticationMiddleware();

        app.post('/testAuthenticationTokenInvalidBearer', middleware, (req, res) => {
            res.send(req.body);
        });

        const token = 'aosidjas09dajsd09ajsd09asjd0a9sjd';

        const response = await request(app)
            .post('/testAuthenticationTokenInvalidBearer')
            .set('Authorization', token)
            .send({});

        expect(response.status).toBe(401);
    });

    test('should return 401 if invalid token is provided', async () => {
        const middleware = makeAuthenticationMiddleware();

        app.post('/testAuthenticationTokenInvalidToken', middleware, (req, res) => {
            res.send(req.body);
        });

        const token = 'bearer aorwerwer0w9eriuw0e9rw0e9riweirsidjas09dajsd09ajsd09asjd0a9sjd';

        const response = await request(app)
            .post('/testAuthenticationTokenInvalidToken')
            .set('Authorization', token)
            .send({});

        expect(response.status).toBe(401);
    });

    test('should return 200 if valid token is provided', async () => {
        const middleware = makeAuthenticationMiddleware();

        app.post('/testAuthenticationTokenValidToken', middleware, (req, res) => {
            /* @ts-expect-error */
            res.send(req.auth);
        });

        const jwtAdapter = new JwtAdapter(
            config.getTokenSecretTokenKey(),
            config.getTokenSecretRefreshTokenKey(),
            config.getTokenSecretExpires()
        );

        const authData = await jwtAdapter.sign({
            userId: 'valid id'
        });

        const response = await request(app)
            .post('/testAuthenticationTokenValidToken')
            .set('Authorization', `Bearer ${authData.token}`)
            .send({});

        expect(response.status).toBe(200);
        expect(response.body.userId).toBe('valid id');
    });

    test('should validate authorization header with case insensitive', async () => {
        const middleware = makeAuthenticationMiddleware();

        app.post('/testAuthenticationTokenValidTokenHeader', middleware, (req, res) => {
            /* @ts-expect-error */
            res.send(req.auth);
        });

        const jwtAdapter = new JwtAdapter(
            config.getTokenSecretTokenKey(),
            config.getTokenSecretRefreshTokenKey(),
            config.getTokenSecretExpires()
        );

        const authData = await jwtAdapter.sign({
            userId: 'valid id'
        });

        const response = await request(app)
            .post('/testAuthenticationTokenValidTokenHeader')
            .set('Authorization', `Bearer ${authData.token}`)
            .send({});

        expect(response.status).toBe(200);
        expect(response.body.userId).toBe('valid id');

        const response2 = await request(app)
            .post('/testAuthenticationTokenValidTokenHeader')
            .set('authorization', `Bearer ${authData.token}`)
            .send({});

        expect(response2.status).toBe(200);
        expect(response2.body.userId).toBe('valid id');

        const response3 = await request(app)
            .post('/testAuthenticationTokenValidTokenHeader')
            .set('AUTHORIZATION', `Bearer ${authData.token}`)
            .send({});

        expect(response3.status).toBe(200);
        expect(response3.body.userId).toBe('valid id');
    });
});
