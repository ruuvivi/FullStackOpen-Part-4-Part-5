const { test, after, beforeEach } = require('node:test')
const { describe } = require('node:test')
const Blog = require('../models/blog')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const { title } = require('node:process')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('return blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('get blogs', () => {
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
  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
})

describe('get blogs with proper id', () => {
  test('unique identifier property is id, not _id', async () => {
    const blogsAtStart = await helper.blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    assert.deepStrictEqual(resultBlog.body, blogToView)
  })
})

describe('post blogs', () => {
  test('a blog can be created with POST', async () => {
    const newBlog = {
      title: "Cuisine",
      author: "Pasta Man",
      url: "http://food.com",
      likes: 543,
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    assert.strictEqual(response.body.title, newBlog.title)
    assert.strictEqual(response.body.author, newBlog.author)
    assert.strictEqual(response.body.url, newBlog.url)
    assert.strictEqual(response.body.likes, newBlog.likes)
  
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  
    const blogTitle = blogsAtEnd.map(b => b.title)
    assert(blogTitle.includes(newBlog.title))
  })
})

describe('post of improper blogs', () => {
  test('blog without likes gets 0 likes', async () => {
    const newBlog = {
      "title": "Cuisine",
      "author": "Pasta Man",
      "url": "http://food.com"
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
      const blogsAtEnd = await helper.blogsInDb()
      const findBlog = blogsAtEnd.find(b => b.title === newBlog.title)
      assert.strictEqual(findBlog.likes, 0)
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })
  test('blogs without title or url cannot be posted', async () => {
    const newBlog = {
      "author": "Pasta Man",
      likes: 543,
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('delete blogs', () => {
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
})

after(async () => {
  await mongoose.connection.close()
})