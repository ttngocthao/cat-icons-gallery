const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/Blog')
const testHelper = require('./test_helper')
const initialBlogs = require('./blogs_data')

beforeAll(async (done) => {
  const url = process.env.TEST_MONGODB_URL
  await mongoose.connect(url, { useNewUrlParser: true })
  done()
})

describe('testing get request to /api/blogs',()=>{
    beforeEach(async()=>{
        await Blog.deleteMany({})
               
        const blogObjs = testHelper.initialBlogs.map(blog=> new Blog(blog)) 
        const promiseArr = blogObjs.map(blog=>blog.save())
        await Promise.all(promiseArr)
    })

    test('blogs are returned as json',async()=>{    
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)    
            
    })

    test('returns the correct amount of blog post',async()=>{
        const res = await api.get('/api/blogs')        
        expect(res.body).toHaveLength(testHelper.initialBlogs.length)
       
    })

    test('the unique property of the blog posts is named id',async()=>{
        const res = await api.get('/api/blogs')
        const firstItem = res.body[0]       
        expect(firstItem.id).toBeDefined()
    })
})

describe('testing post request to /api/blogs',()=>{
    beforeEach(async()=>{
        await Blog.deleteMany({})               
        const blogObjs = testHelper.initialBlogs.map(blog=> new Blog(blog)) 
        const promiseArr = blogObjs.map(blog=>blog.save())
        await Promise.all(promiseArr)
    })
   
   describe('addition of a new blog',()=>{
       test('failed to add if title or url is missing',async(done)=>{         
           const newPost ={
                author: "Thao Truong"
           }
           await api.post('/api/blogs').send(newPost).expect(400)
           done()

       })

        test('get success status if title, author and url are valid',async(done)=>{
            await api
            .post('/api/blogs')
            .send(testHelper.newValidPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            done()
        })

       describe('when adding status is successful',()=>{
            let blogsInDb
            beforeAll(async(done)=>{
                await Blog.deleteMany({})         //drop old data  
                const newDataSet = [...testHelper.initialBlogs, testHelper.newValidPost]     
                const blogObjs = newDataSet.map(blog=> new Blog(blog)) 
                const promiseArr = blogObjs.map(blog=>blog.save())
                await Promise.all(promiseArr) //seed data
                blogsInDb = await testHelper.blogsInDb() //get all data
                done()
            })
           
            test('increase the total number of blogs in the system by one if successful',()=>{
                
                expect(blogsInDb.length).toBe(testHelper.initialBlogs.length+1)
                
            }) 
            
            test('correct blog content is saved to database',()=>{               
                const blogTitles = blogsInDb.map(blog=>blog.title)
                expect(blogTitles).toContain('This is new post')
               
            })

            test('likes for new post will initially be 0',()=>{
                const newAddedPost = blogsInDb.filter(blog=>blog.title==='This is new post')[0]
                expect(newAddedPost.likes).toBe(0)
            })
       })
       
       
      
      
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