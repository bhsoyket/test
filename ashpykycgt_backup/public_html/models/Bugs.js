'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Bugs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Bugs.belongsTo(models.User,{
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            })


        }

    };
    Bugs.init({
        BugText: DataTypes.STRING,
        BugCode: DataTypes.STRING,
        isDeleted: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'Bugs',
    });
    return Bugs;
};