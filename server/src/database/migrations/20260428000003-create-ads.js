'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ads', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      images: { type: Sequelize.JSONB, defaultValue: [] },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'categories', key: 'id' },
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      lat: { type: Sequelize.FLOAT },
      lng: { type: Sequelize.FLOAT },
      status: {
        type: Sequelize.ENUM('active', 'sold', 'inactive'),
        defaultValue: 'active',
      },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ads');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ads_status";');
  },
};
