'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GameHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: {
            tableName: "Games",
          },
          key: "id",
        },
        allowNull: false,
        primaryKey: true,
      },
      result: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ["", "", ""],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GameHistories');
  }
};