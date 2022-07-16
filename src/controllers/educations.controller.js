const { v4: uuidv4 } = require('uuid');
const httpStatus = require('http-status');
const { Educations } = require('../models');
const deleteFile = require('../utils/deleteFile');
const deleteGoogleDrive = require('../utils/deleteGoogleDrive');
const { success, failed } = require('../utils/response');
const uploadGoogleDrive = require('../utils/uploadGoogleDrive');

module.exports = {
  createEducation: async (req, res) => {
    try {
      // upload image to google drive
      let image = null;
      if (req.file) {
        // upload image to google drive
        const photoGd = await uploadGoogleDrive(req.file);
        image = photoGd.id;
        // remove image after upload
        deleteFile(req.file.path);
      }

      const education = await Educations.create({
        ...req.body,
        id: uuidv4(),
        user_id: req.body.userId,
        start_date: req.body.startDate,
        end_date: req.body.endDate,
        image,
      });

      return success(res, {
        code: httpStatus.CREATED,
        message: 'Success create education',
        data: education,
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
