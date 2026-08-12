'use strict';

const categories = [
  { name: 'Cars', slug: 'cars', icon: '🚗', parent_id: null },
  { name: 'Motorcycles', slug: 'motorcycles', icon: '🏍️', parent_id: null },
  { name: 'Mobile Phones', slug: 'mobile-phones', icon: '📱', parent_id: null },
  { name: 'Electronics', slug: 'electronics', icon: '💻', parent_id: null },
  { name: 'Furniture', slug: 'furniture', icon: '🪑', parent_id: null },
  { name: 'Fashion', slug: 'fashion', icon: '👗', parent_id: null },
  { name: 'Real Estate', slug: 'real-estate', icon: '🏠', parent_id: null },
  { name: 'Jobs', slug: 'jobs', icon: '💼', parent_id: null },
  { name: 'Books & Sports', slug: 'books-sports', icon: '📚', parent_id: null },
  { name: 'Pets', slug: 'pets', icon: '🐾', parent_id: null },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', categories, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
