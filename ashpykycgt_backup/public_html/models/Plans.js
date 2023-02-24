'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Plans extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // Plans.hasMany(models.Subscribers,{
            //     onDelete:'CASCADE',
            //     onUpdate:'CASCADE'
            // })

        }

    };
    Plans.init({
        PName: DataTypes.STRING,
        // Description:{  type: DataTypes.JSON,defaultValue: '["'},
        Duration: DataTypes.INTEGER,
        Order: DataTypes.INTEGER,
        Price:DataTypes.DECIMAL(10,4),
        Code:DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Plans',
    });
    return Plans;
};