import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUIDV4,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(128),
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
        await queryInterface.dropTable('users');
    }
};
