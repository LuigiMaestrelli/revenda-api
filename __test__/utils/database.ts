import database from '@/infra/db';

export async function truncate(): Promise<void> {
    await Promise.all(
        Object.keys(database.models).map((key: string) => {
            if (['sequelize', 'Sequelize'].includes(key)) return null;

            return database.models[key].destroy({
                where: {},
                force: true,
                cascade: true
            });
        })
    );
}
