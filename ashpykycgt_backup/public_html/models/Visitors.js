'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Visitors extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {



        }

    };
    Visitors.init({
        IPAddress: DataTypes.STRING,
        UserID: DataTypes.INTEGER,
        SubscriberID: DataTypes.INTEGER,
        BubbleID:DataTypes.INTEGER,
        Country: DataTypes.TEXT,
        City: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Visitors',
    });
    return Visitors;
};