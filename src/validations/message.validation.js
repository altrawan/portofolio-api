const Joi = require('joi');

const createMessage = {
  body: Joi.object().keys({}),
};

module.exports = {
  createMessage,
};
