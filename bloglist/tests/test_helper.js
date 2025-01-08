const Blog = require('../models/blog')
const User = require('../models/user')

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

  const initialUsers = [
    {
        _id: "5dc994bb1ef5461f90010c2d",
        username: 'root',
        name: 'rootname',
        password: 'sekret',
        __v: 0
    },
    {
        _id: "5dc994bb1ef5461f90010c2e",
        username: 'username',
        name: 'usernamename',
        password: 'sekret',
        __v: 0
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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
}