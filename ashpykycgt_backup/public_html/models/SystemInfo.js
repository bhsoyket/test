'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SystemInfo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {



        }

    };
    SystemInfo.init({
        LogoImage: DataTypes.STRING,
        MetaTitle: DataTypes.STRING,
        MetaDescription: DataTypes.STRING,
        NotificationSound: DataTypes.STRING,
        Code: DataTypes.STRING,
        BubbleId:DataTypes.INTEGER,
        MaxVideoSize:DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'SystemInfo',
    });
    return SystemInfo;
};