const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


/*
path: /api/blogs
 */
blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1})   
  //console.log('blogs',blogs)
  response.status(200).json(blogs.map(blog=>blog.toJSON()))
    
})

blogsRouter.get('/:id',async(request,response)=>{
  await Blog.findById(request.params.id,(err,doc)=>{
    if(doc){
     response.status(200).json(doc)
    }else{
      response.status(400).end()
    }
  })
})

/**
 * Private
 */
blogsRouter.post('/', async(request, response) => { 
 
  /**
   *? Decode token to get the id 
   *? (as we sign the token with username and id)
   *? (check /controllers/login to see which properties was signed to the token if needed)
  **/
 
  

  const decodedToken = jwt.verify(request.token,process.env.TOKEN_SECRET)

  if(!request.token || !decodedToken.id){
    return response.status(401).json({error: 'Token is missing or invalid'})
  }

  const body = request.body
  const user = await User.findById(decodedToken.id)
  
  if(!user){
    return response.status(400)
    //throw Error('User cannot be found')
  }
  if(!body.title || !body.author || !body.url){
    return response.status(400)
    //throw Error('Title, author and url cannot be empty')
  }
  const blog = new Blog({...body,user: user._id})
  const savedBlog = await blog.save()
  
  //add blog id into blogs property and save the user database
  user.blogs = [...user.blogs,savedBlog._id]
  await user.save()

  response.status(201).json(savedBlog)
   
})

blogsRouter.delete('/:id',async(request,response)=>{
 const decodedToken = jwt.verify(request.token,process.env.TOKEN_SECRET)

  if(!request.token || !decodedToken.id){
    return response.status(401).json({error: 'Token is missing or invalid'})
  }

  const body = request.body
  const user = await User.findById(decodedToken.id)
  
  if(!user){
    return response.status(400)
    //throw Error('User cannot be found')
  }
  /**
   * TODO --> find the blog --> check if blog exist
   * TODO --> check if user is the same with the post creator
   * TODO --> if so allow delete
   * TODO --> if not send Unauthorized status error
   */
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(400).json({error:'blog does not exist'})
  }
  if(blog.user.toString()!==user._id.toString()){
    return response.status(401).json({error:'No Authorization to delete the blog'})
  }
  const result = await blog.deleteOne()
  console.log('result',result)
  
  return response.status(204).json({msg: 'blog is successfully deleted'})
 
 
  // const result = await Blog.findByIdAndRemove(request.params.id,(err,doc)=>{
  //   if(doc){
  //     response.status(204).end()
  //   }else{
  //      response.status(400).end()
  //   }
  // })
 
  
})

blogsRouter.put('/:id',async(request,response)=>{
  const mongooseOpt = {runValidators: true, new: true}
  const blog = {
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes,
    author: request.body.author
  }
  const res = await Blog.findByIdAndUpdate(request.params.id,{...request.body},mongooseOpt,(err,doc)=>{
    if(doc){
      response.status(200).json(doc)
    }else{
      response.status(400).end()
    }
  })
  
})

module.exports = blogsRouter