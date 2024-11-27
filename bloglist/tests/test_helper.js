const Blog = require('../models/blog')

const initialBlogs= [
    {
        title: "A blog",
        author: "Blog Man",
        url: "http://blog.com",
        likes: 100
    },
    {
        title: "Cats",
        author: "Cat Man",
        url: "http://cat.com",
        likes: 25
    }
  ]

const nonExistingId = async () => {
  const blog = new Blog({ author: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}