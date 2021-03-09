const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/Blog')
const User = require('../models/User')
const testHelper = require('./test_helper')

const loginAsThao =async()=>{
    try {
         const thaoUser ={
        username:'thaotruong',
        password: 'This is my password'
    }
        const res = await api.post('/api/login').send(thaoUser)

        return res.body.token ? res.body.token : null
    } catch (error) {
        console.log(error)
    }
   
}

beforeAll(async (done) => {
 
    await testHelper.openConnection2TestDb()   
  
    done()
})

describe('clear test data and seed data before testing api', ()=>{
        let token
    beforeEach(async(done)=>{
      
        await testHelper.seedData()  
        token = await loginAsThao()       
       
        done()
        
    })
    
    describe('testing get request to /api/blogs',()=>{    

        test('blogs are returned as json',async(done)=>{    
            await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/) 
            done()
        })

        test('returns the correct amount of blog post',async(done)=>{
            const res = await api.get('/api/blogs')        
            expect(res.body).toHaveLength(testHelper.initialBlogs.length)
            done()
        })

        test('the unique property of the blog posts is named id',async(done)=>{
            const res = await api.get('/api/blogs')
            const firstItem = res.body[0]       
            expect(firstItem.id).toBeDefined()
            done()
        })

        test('returned blogs need to have user property',async(done)=>{
            const res = await api.get('/api/blogs')
            const firstItem = res.body[0]
            expect(firstItem.user).toBeDefined()
            expect(firstItem.user.username).toBe('thaotruong')
            done()
        })
       
    })
      
    describe('testing a get single post request to /api/blogs/:id',()=>{
        test('returns correct post if id is valid',async(done)=>{
            const blogsInDb = await testHelper.blogsInDb()
            
            const blogPost = blogsInDb.find(post => testHelper.initialBlogs[0].title===post.title)
           
            const result = await api.get(`/api/blogs/${blogPost.id}`)
         
            expect(result.body.title).toBe(testHelper.initialBlogs[0].title)
            done()
        })

        test('throw 400 error if if id is invalid',async(done)=>{
            await api.get(`/api/blogs/41224d776a326fb40f000001`).expect(400)
            done()
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

    describe('testing update a post request to api/blogs/:id',()=>{
        let blogsAtStart, updateItemId;
        beforeEach(async(done)=>{
            blogsAtStart = await testHelper.blogsInDb()
            updateItemId = blogsAtStart[0].id
            done()
        })
        test('returns 200 status and json if id is valid',async(done)=>{
            blogsAtStart = await testHelper.blogsInDb()
          
            updateItemId = blogsAtStart[0].id
            await api.put(`/api/blogs/${updateItemId}`).expect(200).expect('Content-Type', /application\/json/)
            done()
        })
       
        test('returns 400 status if id is invalid',async(done)=>{
            await api.put(`/api/blogs/41224d776a326fb40f000001`).expect(400)
            done()
        })

        test('returns correct updated item when updates one field if id is valid - ex: likes',async(done)=>{           
            await api.put(`/api/blogs/${updateItemId}`).send({likes: 20})
            const blogsAtEnd = await testHelper.blogsInDb()
            expect(blogsAtEnd[0].likes).toBe(20)
            done()
        })

        test('returns correct updated item when update multiple fields - ex: title & url',async(done)=>{
            await api.put(`/api/blogs/${updateItemId}`).send({title:'This title has been updated',url:'https://updated_url.com'})
            const blogsAtEnd = await testHelper.blogsInDb()
            expect(blogsAtEnd[0].title).toBe('This title has been updated')
            expect(blogsAtEnd[0].url).toBe('https://updated_url.com')
            done()
        })

        
    })

    describe('testing post request to /api/blogs, addition of a new blog',()=>{
        let blogsInDb

        test('failed to add if title or url is missing',()=>{
            const newPost ={  author: "Thao Truong" }
            if(token){
                api
                .post('/api/blogs')
                .send(newPost)
                .set('Authorization','Bearer ' + token)
                .expect(400)
                .end((err,res)=>{
                    if(err) throw err
                })
            }
               
           
           
        })

        // test('failed to add if title or url is missing',async(done)=>{
        //     const newPost ={  author: "Thao Truong" }
        //     await api.post('/api/blogs').send(newPost).set('Authorization','Bearer ' + token).expect(400)
           
        //     done()
        // })

        test('get success status if title, author and url are valid',async(done)=>{           
            const user = await testHelper.usersInDb()
         
            const userId = user[0].id
            const newValidPost ={
                title: "This is new post",
                author:"London King",
                url: "https://londonking.com/",
                userId
            }
            await api
            .post('/api/blogs')
            .send(newValidPost).set('Authorization','Bearer ' + token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

           
            
            done()
        })
       
       test('increase the total number of blogs when adding status is successful',async(done)=>{
            const user = await testHelper.usersInDb()
         
            const userId = user[0].id
            const newValidPost ={
                title: "This is new post",
                author:"London King",
                url: "https://londonking.com/",
                userId
            }
            await api
            .post('/api/blogs')
            .send(newValidPost).set('Authorization','Bearer ' + token)

            blogsInDb = await testHelper.blogsInDb()
            expect(blogsInDb.length).toBe(testHelper.initialBlogs.length+1)
            done()
       })
       
       test('correct blog content is saved to database when adding status is successful',async(done)=>{
            const user = await testHelper.usersInDb()
         
            const userId = user[0].id
            const newValidPost ={
                title: "This is new post",
                author:"London King",
                url: "https://londonking.com/",
                userId
            }
            await api
            .post('/api/blogs')
            .send(newValidPost).set('Authorization','Bearer ' + token)

            blogsInDb = await testHelper.blogsInDb()

            const blogTitles = blogsInDb.map(blog=>blog.title)

            expect(blogTitles).toContain('This is new post')
            
            done()
       })

       test('likes for new post will initially be 0 when adding status is successful',async(done)=>{
            const user = await testHelper.usersInDb()
         
            const userId = user[0].id
            const newValidPost ={
                title: "This is new post",
                author:"London King",
                url: "https://londonking.com/",
                userId
            }
            await api
            .post('/api/blogs')
            .send(newValidPost).set('Authorization','Bearer ' + token)

            blogsInDb = await testHelper.blogsInDb()

            const newAddedPost = blogsInDb.filter(blog=>blog.title==='This is new post')[0]

            expect(newAddedPost.likes).toBe(0)
            
            done()

       })
    })
    
})



afterAll(async(done)=>{
   
   
    await testHelper.closeConnection2TestDb()
   
    done()
})

/**
 *  describe('testing post request to /api/blogs, addition of a new blog',()=>{       
        
        
        

        
        describe('when adding status is successful',()=>{
                let blogsInDb
                beforeAll(async(done)=>{
                    blogsInDb = await testHelper.blogsInDb() //get all data
                    done()
                })

                test('increase the total number of blogs in the system by one if successful',(done)=>{
                    console.log('blogsInDb',blogsInDb)
                    console.log('initialBlogs',testHelper.initialBlogs)
                 
                    expect(blogsInDb.length).toBe(testHelper.initialBlogs.length+1)
                    done()
                }) 
                
                test('correct blog content is saved to database',(done)=>{   
                  
                    const blogTitles = blogsInDb.map(blog=>blog.title)
                    expect(blogTitles).toContain('This is new post')
                    done()
                
                })

                test('likes for new post will initially be 0',(done)=>{
                   
                    const newAddedPost = blogsInDb.filter(blog=>blog.title==='This is new post')[0]
                    expect(newAddedPost.likes).toBe(0)
                    done()
                })

                
        })   
        
        
        
    })
   
 */