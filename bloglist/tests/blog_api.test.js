const { test, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  const db = await helper.blogsInDb()
  console.log(db)
})

test('blogs are returned as json', async () => {
  const blogsAtStart = await helper.blogsInDb()
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

   assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('there are two blogs', async () => {
    const response = await api
    .get('/api/blogs')
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

test('the first blog is about a blog man', async () => {
  const response = await api
  .get('/api/blogs')

  const authors = response.body.map(e => e.author)
  // is the argument truthy
  assert(authors.includes('Blog Man'))
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    "title": "Cuisine", "author": "Pasta Man", "url": "http://food.com", "likes": "33"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
    const authors = blogsAtEnd.map(n => n.author)

  assert(authors.includes('Pasta Man'))
})

/*test('blog without title is not added', async () => {
  const newBlog = {
    "author": "Pasta Man", "url": "http://food.com", "likes": "33"
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})*/

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const authors = blogsAtEnd.map(r => r.author)
  assert(!authors.includes(blogToDelete.author))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})