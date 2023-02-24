'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bubbles extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            Bubbles.belongsTo(models.User,{
                    onDelete:'CASCADE',
                    onUpdate:'CASCADE'
                })


        }

    };
    Bubbles.init({
        BubbleName: DataTypes.STRING,
        BubbleVideo: DataTypes.STRING,
        BubbleGif: DataTypes.STRING,
        BubbleFontSize:DataTypes.INTEGER,
        BubbleTitle: DataTypes.STRING,
        BubbleSize: DataTypes.INTEGER,
        BubbleBorderColor:DataTypes.STRING,
        BubbleBackgroundColor:DataTypes.STRING,
        BubbleButtonColor:DataTypes.STRING,
        BubbleFontFamily:DataTypes.STRING,
        BubbleDarken:DataTypes.BOOLEAN,
        BubbleStyle:DataTypes.STRING,
        BubblePosition:DataTypes.STRING,
        BubbleVideoFit:DataTypes.BOOLEAN,
        BubbleDelay:DataTypes.INTEGER,
        BubbleFirstMessageDelay:{  type:  DataTypes.INTEGER,defaultValue: 4},
        IsDeleted:DataTypes.BOOLEAN,
        BubbleAnimation:DataTypes.STRING,
        BubbleCode:DataTypes.STRING,
        BubbleDeactivated:{  type:  DataTypes.BOOLEAN,defaultValue: 0},
        BubbleAllPages:{  type:  DataTypes.BOOLEAN,defaultValue: 0},
        BubbleExcPages:DataTypes.JSON,
        BubbleGreetMsg:{  type:  DataTypes.STRING,defaultValue: "Hey, thanks for visiting! Feel free to ask anything."},
        BubbleAvailable:{  type:  DataTypes.BOOLEAN,defaultValue: 1},


    }, {
        sequelize,
        modelName: 'Bubbles',
    });
    return Bubbles;
};