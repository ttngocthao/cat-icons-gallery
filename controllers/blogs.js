const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const logger = require('../utils/logger')
/*
path: /api/blogs
 */
blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})   
  // console.log('blogs',blogs)
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

blogsRouter.post('/', async(request, response) => {  
  const blog = new Blog(request.body)
  const result = await blog.save()
 
  response.status(201).json(result)
   
})

blogsRouter.delete('/:id',async(request,response)=>{
 
  const result = await Blog.findByIdAndRemove(request.params.id,(err,doc)=>{
    if(doc){
      response.status(204).end()
    }else{
       response.status(400).end()
    }
  })
 
  
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