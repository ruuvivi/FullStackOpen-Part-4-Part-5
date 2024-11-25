//const Blog = require('../models/blog')
const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs= [
    {
      title: "A blog",
      author: "Blog Man",
      url: "http://blog.com",
      likes: 100,
      id: "673dda185793a2135a12e5b9"
    },
    {
      title: "Cats",
      author: "Cat Man",
      url: "http://cat.com",
      likes: 25,
      id: "6740435d1bc6be6e39e5379c"
    }
  ]


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api
    .get('/api/blogs')
    
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

test('the first blog is about a blog man', async () => {
  const response = await api
  .get('/api/blogs')

  const authors = response.body.map(e => e.author)
  // is the argument truthy
  assert(authors.includes('Blog Man'))
})


after(async () => {
  await mongoose.connection.close()
})
