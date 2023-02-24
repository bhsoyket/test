'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Blog.hasMany(models.Comments,{
            //     onDelete:'CASCADE',
            //     onUpdate:'CASCADE'
            // })
        }
    };
    Blog.init({
        Title: DataTypes.STRING,
        Description: DataTypes.STRING,
        Content: DataTypes.TEXT('long'),
        Publisher: DataTypes.STRING,
        Date: DataTypes.DATE,
        Image:DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Blog',
    });
    return Blog;
};