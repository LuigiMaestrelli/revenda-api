import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('brands', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            description: {
                type: new Sequelize.STRING(200),
                allowNull: false
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('brands');
    }
};
