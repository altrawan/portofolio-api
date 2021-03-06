'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          name: 'Nur Muhammad Alif Putra Setiawan',
          email: 'muhammadalifputra8888@gmail.com',
          password: bcrypt.hashSync('altrawan', 10),
          role: 'Fullstack Web Developer',
          phone: '+62-812-3456-7890',
          address: 'Ciamis, West Java',
          description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Eveniet officia excepturi cupiditate facere architecto dolores earum? Ad, possimus,
          aspernatur ratione laborum maiores maxime odit sunt quae placeat commodi, cumque quas!`,
          photo: 'default.png',
          twitter: 'https://twitter.com/altrawan_',
          linkedin: 'https://www.linkedin.com/in/alifputrasetiawan/',
          github: 'https://github.com/altrawan/',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
