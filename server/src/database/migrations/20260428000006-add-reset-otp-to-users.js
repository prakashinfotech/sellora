'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'reset_otp', {
      type: Sequelize.STRING(6),
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'reset_otp_expiry', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'reset_otp');
    await queryInterface.removeColumn('users', 'reset_otp_expiry');
  },
};
