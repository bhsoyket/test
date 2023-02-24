'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.Comments,{
      //   onDelete:'CASCADE',
      //   onUpdate:'CASCADE'
      // })
      User.hasOne(models.Plans,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })
      User.hasMany(models.messages,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
      })
    }
  };
  User.init({
    userGroup: DataTypes.INTEGER,
    Name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    Image:DataTypes.STRING,//file image
    CroppedImage:DataTypes.STRING,//file image
    BusinessName:DataTypes.STRING,
    Industry:DataTypes.STRING,
    WebsiteURL:DataTypes.STRING,
    Goals:DataTypes.STRING,
    isEnrolled:DataTypes.BOOLEAN,
    Banned: DataTypes.BOOLEAN,
    Verified: DataTypes.BOOLEAN,
    LiveOnBubble:{  type:  DataTypes.BOOLEAN,defaultValue: 1},
    SendEmail:{  type:  DataTypes.BOOLEAN,defaultValue: 0},
    PushNotification:{  type:  DataTypes.BOOLEAN,defaultValue: 0},
    PassReset: DataTypes.STRING,
    googleId: DataTypes.STRING,
    VerifyCode: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};