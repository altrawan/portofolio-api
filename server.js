require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpStatus = require('http-status');
const http = require('http');
const socketIo = require('socket.io');
const listenSocket = require('./src/socket');
const ApiError = require('./src/utils/ApiError');
const { PORT, NODE_ENV } = process.env;

const app = express();

app.use(express.json());

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// set security HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// parse json request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// setting ejs
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'ejs');

// root route
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

// send back a 404 error for any unknown api request
app.use((req, res, next) => res.sendFile(`${__dirname}/public/404.html`));

// setting socket
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');
  listenSocket(io, socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT} with ${NODE_ENV} environment`);
});
