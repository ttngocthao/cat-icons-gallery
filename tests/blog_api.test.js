const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/Blog')

const initialBlogs = require('./blogs_data')

// beforeAll(async (done) => {
//   const url = process.env.TEST_MONGODB_URL
//   await mongoose.connect(url, { useNewUrlParser: true })
//   done()
// })
describe('get request to /api/blogs',()=>{
    beforeEach(async()=>{
        await Blog.deleteMany({})
        initialBlogs.map(async(item)=>{
            const newBlogObj = new Blog(item)
            await newBlogObj.save()
        })
          
    })
    test('blogs are returned as json',async(done)=>{    
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)    
        done()    
    })

    test('returns the correct amount of blog post',async(done)=>{
        const res = await api.get('/api/blogs')        
        expect(res.body).toHaveLength(initialBlogs.length)
        done()
    })
})


// test('a valid blog can be added',async()=>{
//     const newBlog={
//         title: "A valid blog can be added",
//         author: "Thao",
//         url: "example.com",
//         likes: 4
//     }
//     //test if the request is sent
//     await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type',/application\/json/)
//     //test if the database has that new item
//     const res = await api.get('/api/blogs')
//     const blogTitle = res.body.map(r=>r.title)
//     expect(res.body).toHaveLength(1)
//     expect(blogTitle).toContain('A valid blog can be added')
// })

afterAll(async(done)=>{
    await mongoose.connection.close()
    done()
})