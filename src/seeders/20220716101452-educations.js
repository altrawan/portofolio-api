'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'educations',
      [
        {
          id: uuidv4(),
          major: 'Software Engineering',
          school: 'SMK Negeri 1 Kawali',
          address: 'Ciamis, West Java',
          type: 'Full Time',
          start_date: '2016-06-18',
          end_date: '2019-05-02',
          image: 'default.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('educations', null, {});
  },
};
