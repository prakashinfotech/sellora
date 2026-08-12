'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      icon: { type: Sequelize.STRING },
      parent_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' },
        onDelete: 'SET NULL',
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('categories');
  },
};
