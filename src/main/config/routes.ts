import { Express, Router } from 'express';
import path from 'path';

import fileUtils from '@/shared/utils/files';

export default (app: Express): void => {
    const router = Router();
    app.use('/api', router);

    const routesDir = path.join(__dirname, '..', 'routes');
    const routes = fileUtils.getFileList(routesDir, ['.test.', '.spec.', '.map']);

    routes.map(async file => {
        const importedFile = await import(file);
        importedFile.default(router);
    });
};
