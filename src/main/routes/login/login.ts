import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeSignUpController } from '@/main/factories/controller/login/signUpFactory';
import { makeSignInTokenController } from '@/main/factories/controller/login/signInTokenFactory';
import { makeSignInRefreshTokenController } from '@/main/factories/controller/login/signInRefreshTokenFactory';

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()));
    router.post('/signin/token', adaptRoute(makeSignInTokenController()));
    router.post('/signin/refreshtoken', adaptRoute(makeSignInRefreshTokenController()));
};
