'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notifications extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Notifications.belongsTo(models.User,{
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            })
        }
    };
    Notifications.init({
        Reason: DataTypes.STRING,
        To: DataTypes.INTEGER,
        Sender: DataTypes.INTEGER,
        Content: DataTypes.TEXT('long'),
        Since:DataTypes.STRING,
        Time:DataTypes.DATE,
        Seen: DataTypes.BOOLEAN,


    }, {
        sequelize,
        modelName: 'Notifications',
    });
    return Notifications;
};