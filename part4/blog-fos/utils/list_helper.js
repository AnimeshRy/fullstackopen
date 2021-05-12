const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

const favorite = (blogs) => {
  return blogs.reduce((a, b) => (a.likes > b.likes ? a : b));
};

const mostBlogs = (blogs) => {
  const result = blogs.reduce((a, b) => {
    let known = a.find((found) => found.author === b.author);
    if (!known) {
      return a.concat({ author: b.author, blogs: 1 });
    }
    known.blogs++;
    return a;
  }, []);

  return result.reduce((a, b) => (a.blogs > b.blogs ? a : b));
};

const mostLikes = (blogs) => {
  const result = blogs.reduce((a, b) => {
    let known = a.find((found) => found.author === b.author);
    if (!known) {
      return a.concat({ author: b.author, likes: b.likes });
    }
    known.likes += b.likes;
    return a;
  }, []);

  return result.reduce((a, b) => (a.likes > b.likes ? a : b));
};

module.exports = {
  dummy,
  totalLikes,
  favorite,
  mostBlogs,
  mostLikes,
};
