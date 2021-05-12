const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const Blog = require('../model/blog');
const User = require('../model/user');
const helper = require('./test_helper');

jest.setTimeout(60000);

beforeEach(async () => {
  // clear user and blog documents
  await User.deleteMany({});
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let obj = new Blog(blog);
    await obj.save();
  }
});

describe('testing blog api suite', () => {
  test('all blogs returned as json and check length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('check if ID exists on objects', async () => {
    const response = await api.get('/api/blogs');
    response.body.map((blog) => expect(blog.id).toBeDefined());
  });
});

describe('POST/ new blog', () => {
  let headers;
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    };

    await api.post('/api/users').send(newUser);

    const result = await api.post('/api/login').send(newUser);

    headers = {
      Authorization: `bearer ${result.body.token}`,
    };
  });

  test('POST new blog check', async () => {
    const newBlog = {
      title: 'Railway has a Boon',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 16,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain('Railway has a Boon');
  });

  test('blog Unauthorized if token not provided', async () => {
    const newBlog = {
      title: 'Bomkedi has a Boon',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.com/criptions/EWD08xx/EWD808.html',
      likes: 26,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('Check if server returns 400 if title and url missing', async () => {
    const newBlog = {
      author: 'Ramdev Prasad',
      likes: 24,
    };

    await api.post('/api/blogs').send(newBlog).expect(400).set(headers);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('Check if likes revert to 0 when removed', async () => {
    const newBlog = {
      title: 'Ramiya is a fat kid',
      author: 'Baba Ramdev',
      url: 'https://eracodes.com/blog',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = await blogsAtEnd.find(
      (blog) => blog.title === 'Ramiya is a fat kid'
    );
    expect(addedBlog.likes).toBe(0);
  });
});

describe('DELETE/ Blog post', () => {
  let headers;
  beforeEach(async () => {
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password',
    };

    await api.post('/api/users').send(newUser);

    const result = await api.post('/api/login').send(newUser);

    headers = {
      Authorization: `bearer ${result.body.token}`,
    };
  });

  test('delete a blog', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 78,
    };

    // POST new Blog
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .set(headers)
      .expect('Content-Type', /application\/json/);

    // delete blog request
    await api.delete(`/api/blogs/${response.body.id}`).set(headers).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('User API testing', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const newUsers = helper.initialUsers.map((user) => new User(user));
    const userPromises = newUsers.map((user) => user.save());
    await Promise.all(userPromises);
  });

  test('Check if username not provided', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'tesla',
        password: 'nikola',
      })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  test('Check if password not provided', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'tesla',
        name: 'nikola',
      })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  test('Test username length validator', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'ta',
        name: 'nikola',
        password: 'tesla',
      })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  test('Test username unique-ness validator', async () => {
    const response = await api
      .post('/api/users')
      .send({
        username: 'username',
        name: 'nikola',
        password: 'tesla',
      })
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(response.body.error).toContain(
      'User validation failed: username: Error, expected `username` to be unique'
    );
  });

  test('Test password length validator', async () => {
    const response = await api
      .post('/api/users')
      .send({
        username: 'tesla',
        name: 'nikola',
        password: 'te',
      })
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(response.body.error).toContain('Password should be atleast 3');
  });

  test('Check if user is created', async () => {
    const newUser = {
      username: 'tesla',
      name: 'nikola',
      password: 'tesla',
    };
    await api
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(newUser)
      .expect(200);

    const usersAtEnd = await helper.getUsersInDb();
    expect(usersAtEnd.length).toBe(helper.initialUsers.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
