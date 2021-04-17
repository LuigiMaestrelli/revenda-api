import 'module-alias/register';
import database from '@/infra/db';

process.on('uncaughtException', err => {
    console.log('Uncaught exception', err);
    throw err;
});

process.on('unhandledRejection', err => {
    console.log('unhandled rejection', err);
});

console.log('Connecting to the database');

database
    .authenticate()
    .then(
        async (): Promise<void> => {
            console.log('Syncing database structure');
            await database.sync();

            console.log('Starting server');
            const app = (await import('./config/app')).default;

            app.listen(process.env.PORT, () => {
                console.log(`Server started at ${process.env.PORT ?? ''}`);
            });
        }
    )
    .catch(console.error);
