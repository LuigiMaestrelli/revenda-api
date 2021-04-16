import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { RootController } from '@/presentation/controllers/main/root';

export default (router: Router): void => {
    router.get('/', adaptRoute(new RootController()));
};
