'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favourites', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      ad_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'ads', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
    await queryInterface.addIndex('favourites', ['user_id', 'ad_id'], { unique: true });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('favourites');
  },
};
