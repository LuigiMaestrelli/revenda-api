import { Sequelize } from 'sequelize';
import database from '@/infra/db';

describe('Database', () => {
    test('should connect to the test database', async () => {
        const autenticatePromise = database.authenticate();
        await expect(autenticatePromise).resolves.not.toThrow();
    });

    test('should have a decimal parse for postgres', () => {
        /* @ts-expect-error */
        const valor = Sequelize.postgres.DECIMAL.parse('10.2');
        expect(valor).toBe(10.2);
    });

    test('should have a bigint parse for postgres', () => {
        /* @ts-expect-error */
        const valor = Sequelize.postgres.BIGINT.parse('101011');
        expect(valor).toBe(101011);
    });
});
