const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const testHelper = require("./test_helper");
beforeAll(async (done) => {
  // await testHelper.clearDatabase();
  await testHelper.openConnection2TestDb();
  done();
});
describe("get photo/photos", () => {
  beforeEach(async (done) => {
    await testHelper.clearDatabase();
    await testHelper.seedPhotos();

    done();
  });

  // test("dummy", () => {
  //   expect(1).toBe(1);
  // });

  test("get all photos for public route", async () => {
    await api
      .get("/api/photos")
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });

  test("get the correct amount of photo items", async () => {
    const res = await api.get("/api/photos");
    expect(res.body).toHaveLength(testHelper.rawPhotoData.length);
  });
});

afterAll(async (done) => {
  await testHelper.closeConnection2TestDb();

  done();
});
