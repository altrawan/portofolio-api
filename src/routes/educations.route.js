const express = require('express');

const { createEducation } = require('../controllers/educations.controller');
const upload = require('../middlewares/upload');

const Router = express.Router();

Router.post('/education', upload, createEducation);

module.exports = Router;
