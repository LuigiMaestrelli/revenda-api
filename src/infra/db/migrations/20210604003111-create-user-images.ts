import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface, Sequelize: any) => {
        await queryInterface.createTable('userImages', {
            id: {
                type: Sequelize.UUIDV4,
                primaryKey: true,
                autoIncrement: false
            },
            image: {
                type: Sequelize.BLOB,
                allowNull: false
            },
            miniature: {
                type: Sequelize.BLOB,
                allowNull: false
            },
            name: {
                type: new Sequelize.STRING(500),
                allowNull: false
            },
            mimetype: {
                type: new Sequelize.STRING(200),
                allowNull: false
            },
            imageSize: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            miniatureSize: {
                type: Sequelize.DOUBLE,
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
        await queryInterface.dropTable('userImages');
    }
};
