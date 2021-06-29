import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  // Auth States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  // Utility State
  const [errorMessage, seterrorMessage] = useState(null);
  const [successMessage, setsuccessMessage] = useState(null);

  const blogFromRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((initialBlogs) => {
        setBlogs(initialBlogs);
      })
      .catch((error) => {
        seterrorMessage('Looks like the backend server did not send any data');
        setTimeout(() => {
          seterrorMessage(null);
        }, 5000);
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setsuccessMessage('loggin in...');
      setTimeout(() => {
        setsuccessMessage(null);
      }, 1000);
      setUsername('');
      setPassword('');
    } catch (exception) {
      seterrorMessage('Wrong Credentials');
      setTimeout(() => {
        seterrorMessage(null);
      }, 5000);
    }
  };

  // Blog functions

  const addBlog = async (blogtoAdd) => {
    try {
      blogFromRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogtoAdd);
      setBlogs(blogs.concat(returnedBlog));
      setsuccessMessage(
        `new blog ${returnedBlog.title} By ${returnedBlog.author} added`
      );
      setTimeout(() => {
        setsuccessMessage(null);
      }, 4000);
    } catch (exception) {
      let response = exception?.response;
      if (response) {
        seterrorMessage(response.data.error);
      } else {
        seterrorMessage('Some error occured in adding new entry');
      }
      setTimeout(() => {
        seterrorMessage(null);
      }, 4000);
    }
  };

  const updateBlog = async (BlogtoUpdate) => {
    try {
      const updateBlog = await blogService.update(BlogtoUpdate);
      setsuccessMessage(` Blog ${BlogtoUpdate.title} was successfully updated`);
      setBlogs(
        blogs.map((blog) => (blog.id !== BlogtoUpdate.id ? blog : updateBlog))
      );
      seterrorMessage(null);
      setTimeout(() => {
        setsuccessMessage(null);
      }, 4000);
    } catch (exception) {
      seterrorMessage(`Cannot update blog ${BlogtoUpdate.title}`);
      setsuccessMessage(null);
      setTimeout(() => {
        seterrorMessage(null);
      }, 4000);
    }
  };

  const deleteBlog = async (BlogToDelete) => {
    try {
      if (window.confirm(`Delete ${BlogToDelete.title} ?`)) {
        blogService.remove(BlogToDelete.id);
        setsuccessMessage(
          `Blog ${BlogToDelete.title} was successfully deleted`
        );
        setBlogs(blogs.filter((blog) => blog.id !== BlogToDelete.id));
        seterrorMessage(null);
        setTimeout(() => {
          setsuccessMessage(null);
        }, 4000);
      }
    } catch (exception) {
      seterrorMessage(`Cannot delete blog ${BlogToDelete.title}`);
      setsuccessMessage(null);
      setTimeout(() => {
        seterrorMessage(null);
      }, 5000);
    }
  };

  // Sort
  const sortBylikes = (event) => {
    let blogsCopy = [...blogs];
    blogsCopy.sort((a, b) => a.likes - b.likes);
    setBlogs(blogsCopy);
  };

  // logout
  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  return (
    <div>
      <Notification
        errormessage={errorMessage}
        successmessage={successMessage}
      />
      {user === null ? (
        <Togglable buttonLabel="log in">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            setPassword={setPassword}
            password={password}
          />
        </Togglable>
      ) : (
        <div>
          <p>
            <b>{user.username}</b> logged-in
          </p>
          <button style={{ marginBottom: '2px' }} onClick={handleLogout}>
            logout
          </button>
          <Togglable buttonLabel="Create new blog" ref={blogFromRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}
      <h2>Blogs</h2>
      <button onClick={sortBylikes}>sort</button>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
