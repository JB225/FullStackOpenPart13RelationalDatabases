const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
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
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'session',
    freezeTableName: true
})

module.exports = Session