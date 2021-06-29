import React, { useState } from 'react';
const Blog = (props) => {
  const blog = props.blog;
  const [blogObject, setBlogObject] = useState(blog);
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const buttonLabel = visible ? 'hide' : 'view';

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: {
        // adding user info to request
        _id: blog.user.id,
        username: blog.user.username,
        name: blog.user.name,
      },
    };
    props.updateBlog(updatedBlog);
    setBlogObject(updatedBlog);
  };

  const removeBlog = () => props.deleteBlog(blog);

  const blogStyle = {
    padding: 1.4,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3,
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        <p>
          {blog.title} - {blog.author}{' '}
          <button onClick={toggleVisibility}>{buttonLabel}</button>
        </p>
      </div>
      <div style={showWhenVisible} className="infoDiv">
        <p>
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p className="blog-likes">
          {blogObject.likes}{' '}
          <button id="like-button" onClick={increaseLikes}>
            like
          </button>
        </p>
        <button id="remove" onClick={removeBlog}>
          remove
        </button>
      </div>
    </div>
  );
};

export default Blog;
