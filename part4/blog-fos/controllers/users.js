const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../model/user');

function CustomException(message) {
  const error = new Error(message);

  error.name = 'ValidationError';
  return error;
}

CustomException.prototype = Object.create(Error.prototype);

usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.password || body.password.length < 3)
    throw new CustomException(
      'Password should be atleast 3 characters or more'
    );

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(users.map((u) => u.toJSON()));
});

module.exports = usersRouter;
