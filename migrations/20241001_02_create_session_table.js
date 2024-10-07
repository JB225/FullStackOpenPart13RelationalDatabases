const { DataTypes } = require('sequelize')

module.exports = {
    up: async({ context: queryInterface }) => {
        await queryInterface.createTable('session', {
            sid: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            expires: {
                type: DataTypes.DATE
            },
            data: {
                type: DataTypes.TEXT
            }
        })
        await queryInterface.addColumn('users', 'enabled', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('session')
    }
}