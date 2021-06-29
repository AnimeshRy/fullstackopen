const blogRouter = require('express').Router();
const Blog = require('../model/blog');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');
const process = require('process');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body;
    const token = request.token; //middleware handles token extraction
    const user = request.user;

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog.toJSON());
  }
);

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogRouter.delete(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const token = request.token;
    const user = request.user;

    const blogToDelete = await Blog.findById(request.params.id);

    if (blogToDelete.user._id.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      return response.status(401).json({ error: `Unauthorized` });
    }
  }
);

blogRouter.put(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body;
    const token = request.token;
    const user = request.user;
    const blogtoUpdate = await Blog.findById(request.params.id);
    if (blogtoUpdate.user._id.toString() === user._id.toString()) {
      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
      };
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        blog,
        {
          new: true,
        }
      );
      response.json(updatedBlog.toJSON());
    } else {
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }
);

module.exports = blogRouter;
