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
        await User.deleteMany({}) //clear all data if exist
        const password = 'This is my password'
        const passwordHash = await bcrypt.hash(password,10)
        const user = new User({
            username:'thaotruong',
            name:'Thao Truong',
            email:'thao.truong@mail.com',
            passwordHash
        })
        await user.save()
        done()
    })
    test('creates a user successfully',async()=>{
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
})

afterAll(async(done)=>{
    await testHelper.closeConnection2TestDb()
    done()
})