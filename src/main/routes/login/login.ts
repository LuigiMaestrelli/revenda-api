import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeSignUpController } from '@/main/factories/controller/login/signUpFactory';

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()));
};
