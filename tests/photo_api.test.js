const supertest = require("supertest");
const fs = require('mz/fs');
const app = require("../app");
const api = supertest(app);

const testHelper = require("./test_helper");
beforeAll(async (done) => {
  // await testHelper.clearDatabase();
  await testHelper.openConnection2TestDb();
  await testHelper.clearDatabase();
  done();
});



describe("get photo/photos", () => {
  beforeEach(async (done) => {
    await testHelper.seedPhotos();
    done();
  });

  test("get all photos for public route", async () => {    
   
   // await testHelper.seedPhotos();
    const res = await api.get("/api/photos");
   // console.log('res',res);
   expect(res.status).toBe(201)
   expect(res.type).toBe('application/json');
    expect(res.body).toHaveLength(testHelper.rawPhotoData.length);

     
  });

 


});

describe('POST - /api/photos - upload photo',()=>{
   

  test('should upload the test file to the server',()=>{
     const filePath = `${__dirname}/images/testing.jpg`; 
     // Test if the test file is exist
    fs.exists(filePath)
      .then(async (exists) => {
       
        const testUser = await testHelper.seedUsers({userName:'upload file user', email:'uploadfileuser@mail.com'});

        const newPhotoParams = {     
          createdBy: testUser.id
          // albumId:'Testing album'    
        };

        if(!exists)throw new Error('file does not exist');
        const res = await api.post('/api/photos').attach('file', filePath).send(newPhotoParams);
        const {approved,createdBy,name,extension,path,id } = res.body;
        
        expect(approved).toBe(false);
        expect(createdBy).toBe(newPhotoParams.createdBy);
        expect(id).toBeDefined();

        

      })
  })
})

afterAll(async (done) => {
  await testHelper.clearDatabase();
  await testHelper.closeConnection2TestDb();

  done();
});
