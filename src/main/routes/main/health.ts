import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { ServerHealthController } from '@/presentation/controllers/main/serverHealth';
import { DatabaseHealthController } from '@/presentation/controllers/main/databaseHealth';
import { AuthHealthController } from '@/presentation/controllers/main/authHealth';
import { makeAuthenticationMiddleware } from '@/main/factories/middleware/authenticationFactory';

export default (router: Router): void => {
    router.get('/health/server', adaptRoute(new ServerHealthController()));
    router.get('/health/database', adaptRoute(new DatabaseHealthController()));
    router.get('/health/auth', makeAuthenticationMiddleware(), adaptRoute(new AuthHealthController()));
};
