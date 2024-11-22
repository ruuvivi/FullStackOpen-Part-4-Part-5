const blog = require('../models/blog')
const _ = require('lodash');

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const likes = 0;
    const total = blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        likes,
        );
    return total
}

const favoriteBlog = (blogs) => {
    const favorite = blogs.reduce((accumulator, currentValue) => {
        return accumulator.likes > currentValue.likes ? accumulator : currentValue})
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes,
    }
}

const mostBlogs = (blogs) => {
    const most = _.map(_.groupBy(blogs, 'author'), (blog, author) => ({
        author,
        blogs: blog.length
    }))
    return _.maxBy(most, 'blogs')
}

const mostLikes = (blogs) => {
    const most = _.map(_.groupBy(blogs, 'author'), (blog, author) => ({
        author,
        likes: _.sumBy(blog, 'likes')
    }))
    return _.maxBy(most, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
    }