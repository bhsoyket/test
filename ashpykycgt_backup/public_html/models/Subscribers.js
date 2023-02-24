'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Subscribers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Subscribers.belongsTo(models.Plans,{
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            }),
            Subscribers.belongsTo(models.User,{
                onDelete:'CASCADE',
                onUpdate:'CASCADE'
            })
            // Subscribers.hasMany(models.planTable,{
            //     onDelete:'CASCADE',
            //     onUpdate:'CASCADE'
            // })


        }

    };
    Subscribers.init({
        PName: DataTypes.STRING,
        PCode: DataTypes.STRING,
        Subscriber: DataTypes.STRING,
        SubscriberID:DataTypes.INTEGER,
        Price:DataTypes.STRING,
        Duration:{type: DataTypes.INTEGER,defaultValue: 1},
        CurrentMonth:{type: DataTypes.INTEGER,defaultValue: 1},
        EndSubscribeDate:DataTypes.DATE,
        isActive:DataTypes.BOOLEAN,
        isFinished:DataTypes.BOOLEAN,


    }, {
        sequelize,
        modelName: 'Subscribers',
    });
    return Subscribers;
};