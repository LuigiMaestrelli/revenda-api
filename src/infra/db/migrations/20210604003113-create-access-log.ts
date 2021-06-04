import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('accesslog', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true
            },
            authorized: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            email: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            ip: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            userAgent: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            hostName: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            origin: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true
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
        await queryInterface.dropTable('accesslog');
    }
};
