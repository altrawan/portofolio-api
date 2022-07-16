require('dotenv').config();
const Redis = require('redis');
const { REDIS_PORT, REDIS_HOST, REDIS_USER, REDIS_PASSWORD } = process.env;

const redis = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  username: REDIS_USER,
  password: REDIS_PASSWORD,
  db: 0, // defaults to 0
});

module.exports = { redis };
