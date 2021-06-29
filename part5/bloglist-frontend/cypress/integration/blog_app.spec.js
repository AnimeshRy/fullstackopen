describe('Blog App e2e tests', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Animesh Singh',
      username: 'animeshry',
      password: 'test',
    };
    cy.request('POST', 'http://localhost:3003/api/users', user);
    cy.visit('http://localhost:3000');
  });

  it('login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('animeshry');
      cy.get('#password').type('test');
      cy.get('#login-button').click();
      cy.contains('animeshry logged-in');
    });

    it('login fails with wrong password', function () {
      cy.contains('log in').click();
      cy.get('#username').type('animeshry');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('.error')
        .should('contain', 'Wrong Credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'animeshry logged-in');
    });
  });

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'animeshry', password: 'test' });
    });

    it('a new blog can be created', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('e2e tests are worth it?');
      cy.get('#author').type('Ramesh Bidhudi');
      cy.get('#url').type('https://www.mockurl.com');
      cy.contains('add').click();

      cy.contains('e2e tests are worth it? - Ramesh Bidhudi');
    });

    it('User can like a blog', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('e2e tests are worth it?');
      cy.get('#author').type('Ramesh Bidhudi');
      cy.get('#url').type('https://www.mockurl.com');
      cy.contains('add').click();

      cy.contains('view').click();
      cy.get('.blog-likes').contains('0'); // no. of likes
      cy.get('#like-button').click();
      cy.get('.blog-likes').contains('1');
    });

    it('User who created can delete blog', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('e2e tests are worth it?');
      cy.get('#author').type('Ramesh Bidhudi');
      cy.get('#url').type('https://www.mockurl.com');
      cy.contains('add').click();

      cy.contains('view').click();
      cy.get('#remove').click();
      cy.get('html').should(
        'not.contain',
        'e2e tests are worth it? - Ramesh Bidhudi'
      );
    });
  });

  describe('Blogs ordered by number of likes', function () {
    beforeEach(function () {
      cy.login({ username: 'animeshry', password: 'test' });
      cy.createBlog({
        author: 'John Doe',
        title: 'test1',
        url: 'http://example.com./test1',
      });
      cy.createBlog({
        author: 'John Snow',
        title: 'test2',
        url: 'http://example.com./test2',
      });
      cy.createBlog({
        author: 'Jane Doe',
        title: 'test3',
        url: 'http://example.com./test3',
      });

      cy.contains('John Doe').parent().parent().as('blog1');
      cy.contains('John Snow').parent().parent().as('blog2');
      cy.contains('Jane Doe').parent().parent().as('blog3');
    });

    it('Blogs are sorted by number of likes', function () {
      cy.get('@blog1').contains('view').click();
      cy.get('@blog2').contains('view').click();
      cy.get('@blog3').contains('view').click();
      cy.get('@blog1').contains('like').as('like1');
      cy.get('@blog2').contains('like').as('like2');
      cy.get('@blog3').contains('like').as('like3');

      cy.intercept('/api/blogs/*').as('blogService');
      cy.get('@like2').click();
      cy.wait('@blogService');
      cy.get('@like1').click();
      cy.wait('@blogService');
      cy.get('@like1').click();
      cy.wait('@blogService');
      cy.get('@like3').click();
      cy.wait('@blogService');
      cy.get('@like3').click();
      cy.wait('@blogService');
      cy.get('@like3').click();
      cy.wait('@blogService');

      cy.contains('sort').click(); // sort values

      cy.get('.blog').then((blogs) => {
        cy.wrap(blogs[0]).contains('1');
        cy.wrap(blogs[1]).contains('2');
        cy.wrap(blogs[2]).contains('3');
      });
    });
  });
});
