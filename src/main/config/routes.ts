import { Express, Router } from 'express';
import path from 'path';
import { getFileList } from '@/shared/utils/files';
import { defaultErrorRoute } from '@/main/routes/defaultErrorRoute';

export default (app: Express): void => {
    const router = Router();
    app.use('/api', router);

    const routesDir = path.join(__dirname, '..', 'routes');
    const routes = getFileList(routesDir, ['.test.', '.spec.', '.map', 'defaultErrorRoute.ts', 'defaultErrorRoute.js']);

    routes.map(async file => {
        const importedFile = await import(file);
        importedFile.default(router);
    });

    defaultErrorRoute(app);
};
