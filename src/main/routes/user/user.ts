import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeGetUserById } from '@/main/factories/controller/user/getUserByIdFactory';
import { makeUpdateUser } from '@/main/factories/controller/user/updateUserFactory';
import { makeActivateUser } from '@/main/factories/controller/user/activateUserFactory';
import { makeInactivateUser } from '@/main/factories/controller/user/inactivateUserFactory';
import { makeAuthenticationMiddleware } from '@/main/factories/middleware/authenticationFactory';

export default (router: Router): void => {
    router.get('/user/:id', makeAuthenticationMiddleware(), adaptRoute(makeGetUserById()));
    router.put('/user/:id', makeAuthenticationMiddleware(), adaptRoute(makeUpdateUser()));
    router.put('/user/:id/active', makeAuthenticationMiddleware(), adaptRoute(makeActivateUser()));
    router.put('/user/:id/inactive', makeAuthenticationMiddleware(), adaptRoute(makeInactivateUser()));
};
