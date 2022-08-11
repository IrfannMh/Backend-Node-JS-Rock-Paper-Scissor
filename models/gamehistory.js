'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Game,{
        foreignKey:'gameId'
      })
    }
  };
  GameHistory.init({
    gameId: DataTypes.INTEGER,
    result: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'GameHistory',
  });
  return GameHistory;
};