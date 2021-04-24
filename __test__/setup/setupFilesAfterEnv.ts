import database from '@/infra/db';

beforeAll(async () => {
    await database.sync({ force: true });
});

afterAll(async () => {
    await database.close();
});
