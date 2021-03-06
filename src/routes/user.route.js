const express = require('express');

const { getUser, createUser } = require('../controllers/user.controller');
const upload = require('../middlewares/upload');

const Router = express.Router();

Router.get('/user/:id', getUser).post('/user', upload, createUser);

module.exports = Router;
