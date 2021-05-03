import database from '@/infra/db';

export async function truncate(): Promise<void> {
    for (const key in database.models) {
        if (['sequelize', 'Sequelize'].includes(key)) continue;

        await database.models[key].destroy({
            where: {},
            force: true,
            cascade: true
        });
    }
}
