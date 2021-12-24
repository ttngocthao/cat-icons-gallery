const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const User = require("../models/User");
const testHelper = require("./test_helper");

beforeAll(async (done) => {
  await testHelper.openConnection2TestDb();
  done();
});

// describe('when there is initially 2 users in db',()=>{
//     beforeEach(async(done)=>{
//         await testHelper.seedData()
//         done()
//     })

//     test('creates a user successfully if inputs valid',async()=>{
//         /**
//          * TODO: 1.check database at first
//          * TODO: 2.add new a new user
//          * TODO: 3.check database after adding
//          * TODO: 4.check if length increase by 1, check if the new user info is there
//         */
//         const usersInDbAtStart = await testHelper.usersInDb()
//         const newUser = {
//             username:'newUser',
//             name:'New User',
//             email:'newUser@mail.com',
//             password:'myPasswordHere'
//         }
//         await api.post('/api/users').send(newUser).expect(201).expect('Content-Type',/application\/json/)
//         const usersInDbAtEnd = await testHelper.usersInDb()
//         expect(usersInDbAtEnd).toHaveLength(usersInDbAtStart.length+1)
//         const allUsernames = usersInDbAtEnd.map(user=>user.username)
//         expect(allUsernames).toContain(newUser.username)

//     })

//     test('not create a user when username is missing',async()=>{
//         const inValidUser = {
//             name:'Paul Denman',
//             email:'paul.denman@mail.com',
//             password:'myPasswordHere'}
//         await api.post('/api/users').send(inValidUser).expect(400)
//     })

//     test('not create a user when password is missing',async()=>{
//         const inValidUser = {
//             username:'inValidUsername',
//             name:'Paul Denman',
//             email:'paul.denman@mail.com',
//         }
//         await api.post('/api/users').send(inValidUser).expect(400)
//     })

//     test('not create a user when username is not unique',async()=>{
//         const newUser = {
//             username:'thaotruong',
//             name:'Paul Denman',
//             email:'paul.denman@mail.com',
//             password:'myPasswordHere'
//         }
//         await api.post('/api/users').send(newUser).expect(400)
//     })

//     test('not create a user when username length is less than 3characters',async()=>{
//         const inValidUser = {
//             username:'be',
//             name:'Paul Denman',
//             email:'paul.denman@mail.com',
//             password:'myPasswordHere'
//         }
//         await api.post('/api/users').send(inValidUser).expect(400)
//     })

//     test('not create a user when password length is less than 3 characters',async()=>{
//         const inValidUser = {
//             username:'pauldenman',
//             name:'Paul Denman',
//             email:'paul.denman@mail.com',
//             password:'ps'
//         }
//         await api.post('/api/users').send(inValidUser).expect(400)
//     })

//     test('returns all users',async()=>{
//         const result = await api.get('/api/users').expect(200)
//         expect(result.status).toBe(200)
//         const usernameList = result.body.map(user=>user.username)
//         expect(usernameList).toContain('thaotruong')  //thaotruong user exists
//         expect(usernameList.length).toBeGreaterThan(1)   //there are more than one users in the database
//     })

//     test('displays blogs created by each user',async()=>{
//         const result = await api.get('/api/users')
//         const blogs = result.body[0].blogs
//         expect(blogs).toBeDefined()
//         expect(blogs.length).toBe(2)
//     })
// })

describe("testing create a user", () => {
  beforeEach(async (done) => {
    await testHelper.clearDatabase();
    done();
  });
  test("creates a user successfully if inputs valid", async () => {
    //  await User.deleteMany();
    const usersInDbAtStart = await testHelper.findUsersInDb(); //check database before create a user
    const newUser = {
      userName: "Thao Truong",
      email: "thao@mail.com",
      password: "myPasswordHere",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersInDbAtEnd = await testHelper.findUsersInDb(); // check database after creating a user
    expect(usersInDbAtEnd).toHaveLength(usersInDbAtStart.length + 1);
    const allUsernames = usersInDbAtEnd.map((user) => user.userName);
    expect(allUsernames).toContain(newUser.userName);

    await testHelper.closeConnection2TestDb();
  });

  test("not create a user if email address has been used before", async () => {
    //  await User.deleteMany();
   const user1 = {
     userName:'user1',
     email:'user1@mail.com'
   }
   await testHelper.seedUsers(user1)
    const usersInDbAtStart = await testHelper.findUsersInDb(); //check database before create a user
    const user2 = {
     userName:'user2',
     email:'user1@mail.com'
   }
   const addUserWithExistenceEmail =async()=>{
     await api.post("/api/users").send(user2)
   }
    expect(addUserWithExistenceEmail).toThrowError(ValidationError)
   // console.log('res',res);
 //   expect(res.status).toBe(400);
    const usersInDbAtEnd = await testHelper.findUsersInDb(); // check database after creating a user

    expect(usersInDbAtEnd.length).toBe(usersInDbAtStart.length);

    
  });
});


afterAll(async (done) => {
    await testHelper.clearDatabase();
  await testHelper.closeConnection2TestDb();
  done();
});