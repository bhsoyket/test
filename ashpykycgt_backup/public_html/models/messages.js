'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class messages extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
messages.belongsTo(models.Chats,{
    onDelete:'CASCADE',
    onUpdate:'CASCADE'
})


        }

    };
    messages.init({
        SenderID: DataTypes.STRING,
        time: DataTypes.DATE,
        ReceiverID: DataTypes.STRING,
        BubbleID: DataTypes.STRING,
        ChatCode:DataTypes.STRING,
        content: DataTypes.STRING,
        isRead:DataTypes.BOOLEAN,


    }, {
        sequelize,
        modelName: 'messages',
    });
    return messages;
};