import { Router } from 'express';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeAuthenticationMiddleware } from '@/main/factories/middleware/authenticationFactory';
import { makeActivateBrand } from '@/main/factories/controller/brand/activateBrandFactory';
import { makeCreateBrand } from '@/main/factories/controller/brand/createBrandFactory';
import { makeDeleteBrand } from '@/main/factories/controller/brand/deleteBrandFactory';
import { makeGetBrandById } from '@/main/factories/controller/brand/getBrandByIdFactory';
import { makeInactivateBrand } from '@/main/factories/controller/brand/inactivateBrandFactory';
import { makeUpdateBrand } from '@/main/factories/controller/brand/updateBrandFactory';

export default (router: Router): void => {
    router.post('/brand', makeAuthenticationMiddleware(), adaptRoute(makeCreateBrand()));
    router.get('/brand/:id', makeAuthenticationMiddleware(), adaptRoute(makeGetBrandById()));
    router.put('/brand/:id', makeAuthenticationMiddleware(), adaptRoute(makeUpdateBrand()));
    router.delete('/brand/:id', makeAuthenticationMiddleware(), adaptRoute(makeDeleteBrand()));
    router.put('/brand/:id/active', makeAuthenticationMiddleware(), adaptRoute(makeActivateBrand()));
    router.put('/brand/:id/inactive', makeAuthenticationMiddleware(), adaptRoute(makeInactivateBrand()));
};
