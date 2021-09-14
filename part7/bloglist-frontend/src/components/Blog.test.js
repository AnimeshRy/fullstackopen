import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('Blog Component Tests', () => {
  let blog = {
    title: 'Chello Player',
    author: 'Animesh Singh',
    url: 'https://www.testmockurl.com/',
    likes: 7,
  };

  let mockUpdateBlog = jest.fn();
  let mockDeleteBlog = jest.fn();

  test('renders title and author', () => {
    const component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );
    // Contains Title
    expect(component.container).toHaveTextContent('Chello Player');
    // Contains Author
    expect(component.container).toHaveTextContent('Animesh Singh');

    //Likes and URL Container Check
    const div = component.container.querySelector('.infoDiv');
    expect(div).toHaveStyle('display: none');
  });

  test('clicking the view button displays url and number of likes', () => {
    const component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const button = component.getByText('view');
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      'https://www.testmockurl.com/'
    );

    expect(component.container).toHaveTextContent('7');
  });

  test('Checking number of calls made on updating likes', () => {
    // Added fake user details
    let blog = {
      title: 'Chello Player',
      author: 'Animesh Singh',
      url: 'https://www.testmockurl.com/',
      likes: 7,
      user: {
        id: 123,
        username: 'root',
        name: 'SuperSU',
      },
    };
    const component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const button = component.getByText('view');
    fireEvent.click(button);

    const likeButton = component.container.querySelector('#like-button');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockUpdateBlog.mock.calls).toHaveLength(2);
  });
});
