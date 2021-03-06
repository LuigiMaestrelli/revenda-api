import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUIDV4,
                primaryKey: true,
                autoIncrement: false
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
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('users');
    }
};
