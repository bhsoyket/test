'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chats extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            Chats.hasMany(models.messages,{
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            })
        }

    };
    Chats.init({

        Chat_Cookie_id: DataTypes.STRING,
        ChatCode: DataTypes.STRING,
        ClientName: DataTypes.TEXT,
        ClientIPAddress: DataTypes.STRING,
        ClientCity: DataTypes.STRING,
        ClientCountry: DataTypes.STRING,
        ClientEmail: DataTypes.STRING,
        HosterID: DataTypes.INTEGER,
        BubbleID: DataTypes.INTEGER,
        Chat_Date: DataTypes.DATE,
        NewChat: {  type:  DataTypes.BOOLEAN,defaultValue: 0},
        SubscriberID: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Chats',
    });
    return Chats;
};