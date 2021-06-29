const testingRouter = require('express').Router();
const { request } = require('express');
const Blog = require('../model/blog');
const User = require('../model/user');

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = testingRouter;
