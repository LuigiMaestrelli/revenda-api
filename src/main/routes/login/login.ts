import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeSignUpController } from '@/main/factories/controller/login/signUpFactory';
import { makeSignInController } from '@/main/factories/controller/login/signInFactory';

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()));
    router.post('/signin/token', adaptRoute(makeSignInController()));
};
