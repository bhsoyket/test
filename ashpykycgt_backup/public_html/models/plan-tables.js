'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class planTable extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

        }
    };
    planTable.init({
        ExerciseID:DataTypes.STRING,
        Exercise: DataTypes.STRING,
        Reps: DataTypes.STRING,
        Sets: DataTypes.STRING,
        isSuperSet:DataTypes.BOOLEAN,
        isRest:DataTypes.BOOLEAN,
        isDeleted:DataTypes.BOOLEAN,
        Day:DataTypes.STRING,
        Week:DataTypes.STRING,
        RowID:DataTypes.INTEGER,
        gif: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'planTable',
    });
    return planTable;
};