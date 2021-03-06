import path from 'path';
import moduleAlias from 'module-alias';

moduleAlias.addAliases({
    '@': path.join(__dirname, '..')
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception', err);
    throw err;
});

process.on('unhandledRejection', err => {
    console.log('unhandled rejection', err);
});

console.log('Connecting to the database');

// eslint-disable-next-line
import config from '@/main/config';
// eslint-disable-next-line
import database from '@/infra/db';

database
    .authenticate()
    .then(async (): Promise<void> => {
        console.log('Syncing database structure');
        await database.sync();

        console.log('Starting server');
        const app = (await import('./config/app')).default;

        const portNumber = config.getSystemConfig().serverPort;
        app.listen(portNumber, () => {
            console.log(`Server started at ${portNumber ?? ''}`);
        });
    })
    .catch(console.error);
