'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      ad_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ads', key: 'id' } },
      razorpay_order_id: { type: Sequelize.STRING, allowNull: false },
      razorpay_payment_id: { type: Sequelize.STRING, allowNull: true },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      plan: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: 'created' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  },
};
