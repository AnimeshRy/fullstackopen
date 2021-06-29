const config = require('./utils/config');
const express = require('express');
const app = express();
require('express-async-errors');
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const testingRouter = require('./controllers/testing');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info(`connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to mongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to mongoDB', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
