const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)

const User = require('../models/User')
const testHelper = require('./test_helper')

/**
 * TODO: 1.Open connection before all tests
 * TODO: 2.Close connection after all tests
 * TODO: 3.Before each test, clear exist data then seed data
 */
beforeAll(async(done)=>{
    await testHelper.openConnection2TestDb()
    done()
})

describe('when there is initially one user in db',()=>{    
    beforeEach(async(done)=>{
        await testHelper.seedData()
        done()
    })

    test('creates a user successfully if inputs valid',async()=>{
        /**
         * TODO: 1.check database at first
         * TODO: 2.add new a new user
         * TODO: 3.check database after adding
         * TODO: 4.check if length increase by 1, check if the new user info is there
        */
        const usersInDbAtStart = await testHelper.usersInDb()
        const newUser = {
            username:'pauldenman',
            name:'Paul Denman',
            email:'paul.denman@mail.com',
            password:'myPasswordHere'
        }
        await api.post('/api/users').send(newUser).expect(201).expect('Content-Type',/application\/json/) 
        const usersInDbAtEnd = await testHelper.usersInDb()
        expect(usersInDbAtEnd).toHaveLength(usersInDbAtStart.length+1)
        const allUsernames = usersInDbAtEnd.map(user=>user.username)
        expect(allUsernames).toContain(newUser.username)

    })

    test('not create a user when username is missing',async()=>{
        const inValidUser = { 
            name:'Paul Denman',
            email:'paul.denman@mail.com',
            password:'myPasswordHere'}
        await api.post('/api/users').send(inValidUser).expect(400)
    })

    test('not create a user when password is missing',async()=>{
        const inValidUser = { 
            username:'pauldenman',
            name:'Paul Denman',
            email:'paul.denman@mail.com',
        }
        await api.post('/api/users').send(inValidUser).expect(400)
    })

    test('not create a user when username is not unique',async()=>{
        const newUser = {
            username:'thaotruong',
            name:'Paul Denman',
            email:'paul.denman@mail.com',
            password:'myPasswordHere'
        }
        await api.post('/api/users').send(newUser).expect(400)
    })

    test('not create a user when username length is less than 3characters',async()=>{
        const inValidUser = {
            username:'be',
            name:'Paul Denman',
            email:'paul.denman@mail.com',
            password:'myPasswordHere'
        }
        await api.post('/api/users').send(inValidUser).expect(400)
    })

    test('not create a user when password length is less than 3 characters',async()=>{
        const inValidUser = {
            username:'pauldenman',
            name:'Paul Denman',
            email:'paul.denman@mail.com',
            password:'ps'
        }
        await api.post('/api/users').send(inValidUser).expect(400)
    })

    test('returns all users ',async()=>{
        const result = await api.get('/api/users').expect(200)
        expect(result.status).toBe(200)
        const usernameList = result.body.map(user=>user.username)
        expect(usernameList).toContain('thaotruong')        
    })

    test('displays blogs created by each user',async()=>{
        const result = await api.get('/api/users')
        const blogs = result.body[0].blogs
        expect(blogs).toBeDefined()
        expect(blogs.length).toBe(2)        
    })
})

afterAll(async(done)=>{
    await testHelper.closeConnection2TestDb()
    done()
})