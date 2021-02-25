const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/Blog')
const testHelper = require('./test_helper')


beforeAll(async (done) => {
  const url = process.env.TEST_MONGODB_URL
  await mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true})
  done()
})

describe('clear test data and seed data before testing api', ()=>{
    beforeEach(async()=>{
        await Blog.deleteMany({})               
        const blogObjs = testHelper.initialBlogs.map(blog=> new Blog(blog)) 
        const promiseArr = blogObjs.map(blog=>blog.save())
        await Promise.all(promiseArr)
    })
    describe('testing get request to /api/blogs',()=>{    

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
      
    
    describe('testing post request to /api/blogs, addition of a new blog',()=>{
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
                    blogsInDb = await testHelper.blogsInDb() //get all data
                    done()
                })
               

                test('increase the total number of blogs in the system by one if successful',async()=>{
                    console.log('blogsInDb',blogsInDb)
                    console.log('initialBlogs',testHelper.initialBlogs)
                    debugger
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
   

    describe('testing delete a post',()=>{
        
        test('returns the amount of blog 1 less and the title of that post could not find if id is valid',async(done)=>{
            const blogsAtStart = await testHelper.blogsInDb()
            const postToDelete = blogsAtStart[0]
            await api.delete(`/api/blogs/${postToDelete.id}`)
            const blogsAtEnd = await testHelper.blogsInDb()
            expect(blogsAtEnd.length).toBe(testHelper.initialBlogs.length-1)
            const titles = blogsAtEnd.map(blog=>blog.title)
            expect(titles).not.toContain(postToDelete.title)
            done()
        })
        test('returns 400 status if id is not valid',async(done)=>{
            await api.delete(`/api/blogs/41224d776a326fb40f000001`).expect(400)
            done()
        })
    })
})



afterAll(async(done)=>{
    await mongoose.connection.close()
    done()
})