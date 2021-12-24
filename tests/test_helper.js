//const Blog = require('../models/Blog')
const Album = require("../models/Album");
const Photo = require("../models/Photo");
const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword");
const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
const rawPhotoData = [
  {
    url: "https://cdn.pixabay.com/photo/2018/04/09/19/55/low-poly-3305284_1280.jpg",
    title: "1",
  },
  {
    url: "https://cdn.pixabay.com/photo/2018/03/20/10/04/illustrator-3242713_1280.jpg",
    title: "2",
  },
  {
    url: "https://cdn.pixabay.com/photo/2018/03/22/10/09/illustrator-3249914_1280.jpg",
    title: "3",
  },
  {
    url: "https://cdn.pixabay.com/photo/2018/04/06/13/46/poly-3295856_1280.png",
    title: "4",
  },
];
const openConnection2TestDb = async () => {
  const url = process.env.TEST_MONGODB_URL;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

const closeConnection2TestDb = async () => {
  await mongoose.connection.close();
};

// const initialBlogs =[
//     {
//         title: "First Post",
// 		author: "Thao Truong",
// 		url: "https://firstWebsite.com/",
// 		likes: 7,
//     },
//     {
//         title: "Second Post",
// 		author: "Thao Truong",
// 		url: "https://secondWebsite.com/",
// 		likes: 5,
//     }
// ]

// const blogsInDb = async()=>{
//     const blogs = await Blog.find({})
//     return blogs.map(blog=>blog.toJSON())
// }

const findUsersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const clearDatabase = async () => {
  try {
    // await Album.deleteMany({});
    await Photo.deleteMany({});
    await User.deleteMany({});
  } catch (error) {
    console.log(error);
  }
};

const seedUsers = async ({ userName, email }={}) => {
  
  const passwordHash = await hashPassword("My password");
  const defaultUser = new User({
    userName: userName ? userName : "New User",
    email: email ? email : "newUser@mail.com",
    passwordHash,
  });
  const result = await defaultUser.save();
  return result;
};

const seedPhotos = async () => {
  const user1 = await seedUsers({ userName: "user1", email: "user1@mail.com" });
  const user2 = await seedUsers({ userName: "user2", email: "user2@mail.com" });
  const users = [user1._id, user2._id];
  const randomNumber = Math.floor(Math.random() * users.length);
  const getImageMimetype = (imageUrl) => {
    const extension = imageUrl.slice(-3);
    const options = [
      { type: "image/jpeg", extension: "jpg" },
      { type: "image/png", extension: "png" },
    ];
    const correctOption = options.find((item) => item.extension === extension);
    return correctOption ? correctOption.type : null;
  };
  /**
   *  name: filename,
      createdBy: createdBy,
      extension: mimetype,
      path: path,
   */
  const createAPhoto = async (item) => {
    const itemData = new Photo({
      name: `Image-${item.title}`,
      createdBy: users[randomNumber],
      extension: getImageMimetype(item.url),
      path: item.url,
    });
    //  const newPhoto = await itemData.save();
    return await itemData.save();
  };

  return Promise.all(
    rawPhotoData.map(async (item) => {
      createAPhoto(item);
    })
  );
};

// const seedData = async () => {
//   /**
//    * ! delete all photos,albums and user
//    * ! create a new user
//    * ! create 2 blogs with that new user
//    * ! update user with that new blog posts --> have to do one by one or they fail to work
//    */
//   // await Album.deleteMany({})
//   // await Photo.deleteMany({})
//   // await User.deleteMany({})

//   const password = "This is my password";
//   const passwordHash = await bcrypt.hash(password, 10);
//   const userInfo = new User({
//     username: "thaotruong",
//     name: "Thao Truong",
//     email: "thao.truong@mail.com",
//     passwordHash,
//   });
//   //save user to database
//   const newUser = await userInfo.save();

//   //add user to blog post
//   const blogsWithUser = initialBlogs.map((blog) => ({
//     ...blog,
//     user: newUser._id,
//   }));

//   //save the first post to Blog collection
//   const firstPost = await new Blog(blogsWithUser[0]).save();
//   //add first post to user.blogs and save User collection
//   newUser.blogs = [...newUser.blogs, firstPost._id];
//   await newUser.save();

//   //save the second post to Blog collection
//   const secondPost = await new Blog(blogsWithUser[1]).save();
//   //add second post to user.blogs and save User collection
//   newUser.blogs = [...newUser.blogs, secondPost._id];
//   await newUser.save();

//   /**
//    * !Add a second user to the database
//    */
//   const secondUser = {
//     username: "paulDenman",
//     name: "Paul Denman",
//     email: "paul@hotmail.com",
//     password: "This is Paul password",
//   };
//   const secondUserInfo = new User({
//     username: secondUser.username,
//     name: secondUser.name,
//     email: secondUser.email,
//     passwordHash: await bcrypt.hash(secondUser.password, 10),
//   });
//   await secondUserInfo.save();
//   //* End add a second user

//   // console.log('allUsersFromDb')
// };

// const newValidPost = {
//   title: "This is new post",
//   author: "London King",
//   url: "https://londonking.com/",
// };

module.exports = {
  clearDatabase,
  findUsersInDb,
  seedUsers,
  seedPhotos,
  rawPhotoData,
  openConnection2TestDb,
  closeConnection2TestDb,
};
