// const supertest = require('supertest')
// const bcrypt = require('bcrypt')
// const app = require('../app')

// const api = supertest(app)

// const Blog = require('../models/Blog')
// const User = require('../models/User')
// const testHelper = require('./test_helper')

// const thaoUser ={
//     username:'thaotruong',
//     password:'This is my password'
// }
// const paulUser ={
//     username:'paulDenman',
//     password:'This is Paul password'
// }
// beforeAll(async (done) => {
//     await testHelper.openConnection2TestDb()
//     done()
// })

// describe('if username and password exists',()=>{
//     beforeEach(async(done)=>{
//         await testHelper.seedData()
//         done()
//     })

//     test('returns token and correct username if username and password matches',async()=>{
//         const res = await api.post('/api/login').send(thaoUser)
//         expect(res.body.token).toBeDefined()
//         expect(res.body.username).toBe(thaoUser.username)
//         expect(res.body.username).not.toBe(paulUser.username)
//     })

//     test('returns 401 status if username does not exist',async()=>{
//         await api.post('/api/login').send({username:'notExistUser',password:'This is a password'}).expect(401)
//     })

//     test('returns 401 status if password does not match',async()=>{
//         await api.post('/api/login').send({username:'thaotruong',password:'This is a wrong password'}).expect(401)
//     })
// })

// afterAll(async(done)=>{
//     await testHelper.closeConnection2TestDb()
//     done()
// })
