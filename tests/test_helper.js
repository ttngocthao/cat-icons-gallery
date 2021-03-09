const Blog = require('../models/Blog')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const openConnection2TestDb =async()=>{
    const url = process.env.TEST_MONGODB_URL
    await mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true,useFindAndModify: false, useCreateIndex: true })
}

const closeConnection2TestDb = async()=>{
    await mongoose.connection.close()
}

const initialBlogs =[
    {
        title: "First Post",
		author: "Thao Truong",
		url: "https://firstWebsite.com/",
		likes: 7,
    },
    {
        title: "Second Post",
		author: "Thao Truong",
		url: "https://secondWebsite.com/",
		likes: 5,
    }
]

const blogsInDb = async()=>{
    const blogs = await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

const usersInDb = async()=>{
    const users = await User.find({})
    return users.map(user=>user.toJSON())
}

const seedData =async()=>{
/**
 * ! delete all blogs and user
 * ! create a new user
 * ! create 2 blogs with that new user
 * ! update user with that new blog posts --> have to do one by one or they fail to work
 */
    await Blog.deleteMany({})   
    await User.deleteMany({})

    const password = 'This is my password'
    const passwordHash = await bcrypt.hash(password,10)
    const userInfo = new User({
        username:'thaotruong',
        name:'Thao Truong',
        email:'thao.truong@mail.com',
        passwordHash
    }) 
    //save user to database
    const newUser = await userInfo.save()

    //add user to blog post
    const blogsWithUser = initialBlogs.map(blog=>({...blog,user: newUser._id}))

    //save the first post to Blog collection
    const firstPost = await new Blog(blogsWithUser[0]).save()
    //add first post to user.blogs and save User collection
    newUser.blogs =[...newUser.blogs, firstPost._id]
    await newUser.save()
   
    //save the second post to Blog collection
    const secondPost = await new Blog(blogsWithUser[1]).save()
    //add second post to user.blogs and save User collection
    newUser.blogs = [...newUser.blogs,secondPost._id]
    await newUser.save()

    /**
     * !Add a second user to the database 
    */
    const secondUser ={
        username:'paulDenman',
        name: 'Paul Denman',
        email:'paul@hotmail.com',
        password:'This is Paul password'
    }
    const secondUserInfo = new User({
        username:secondUser.username,
        name: secondUser.name,
        email:secondUser.email,
        passwordHash: await bcrypt.hash(secondUser.password,10)
    })
    await secondUserInfo.save()
    //* End add a second user

    // console.log('allUsersFromDb')
}


const newValidPost ={
    title: "This is new post",
    author:"London King",
    url: "https://londonking.com/"
}



module.exports={
    initialBlogs,
    seedData,
    newValidPost,
    blogsInDb,
    usersInDb,
    openConnection2TestDb,
    closeConnection2TestDb
}