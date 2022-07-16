const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Users, Educations } = require('../models');
const deleteFile = require('../utils/deleteFile');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const { success, failed } = require('../utils/response');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');

module.exports = {
  getUsers: async (req, res) => {
    try {
      let { page, limit, search, sort, sortType } = req.query;
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      sort = sort || 'store_name';
      sortType = sortType || 'ASC';
      const condition = search
        ? {
            name: { [Op.iLike]: `%${search}%` },
          }
        : null;
      const offset = (page - 1) * limit;

      const users = await Users.findAndCountAll({
        where: condition,
        order: [[`${sort}`, `${sortType}`]],
        limit,
        offset,
      });

      if (!users) {
        return failed(res, {
          code: httpStatus.NOT_FOUND,
          message: 'Users Not Found',
          error: 'Not Found',
        });
      }

      return success(res, {
        code: httpStatus.OK,
        message: 'Success get all user success',
        data: users,
      });
    } catch (error) {
      return failed(res, {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await Users.findByPk(id, {
        include: [
          {
            model: Educations,
            as: 'educations',
          },
        ],
      });

      if (!user) {
        return failed(res, {
          code: httpStatus.NOT_FOUND,
          message: `User with id ${id} not found !`,
          error: 'Not Found',
        });
      }

      return success(res, {
        code: httpStatus.OK,
        message: 'Success get detail user',
        data: user,
      });
    } catch (error) {
      return failed(res, {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  createUser: async (req, res) => {
    try {
      // upload image to google drive
      let photo = null;
      if (req.file) {
        // upload image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        photo = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      const user = await Users.create({
        id: uuidv4(),
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
        photo,
      });

      return success(res, {
        code: httpStatus.CREATED,
        message: 'Success create user',
        data: user,
      });
    } catch (error) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return failed(res, {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
