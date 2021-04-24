import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { ServerHealthController } from '@/presentation/controllers/main/serverHealth';
import { DatabaseHealthController } from '@/presentation/controllers/main/databaseHealth';

export default (router: Router): void => {
    router.get('/health/server', adaptRoute(new ServerHealthController()));
    router.get('/health/database', adaptRoute(new DatabaseHealthController()));
};
