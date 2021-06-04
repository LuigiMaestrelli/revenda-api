import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('errorlog', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            location: {
                type: new Sequelize.STRING(200),
                allowNull: false
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            stack: {
                type: Sequelize.TEXT,
                allowNull: false
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
        await queryInterface.dropTable('errorlog');
    }
};
