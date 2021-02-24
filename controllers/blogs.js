const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})   
  // console.log('blogs',blogs)
  response.json(blogs.map(blog=>blog.toJSON()))
    
})

blogsRouter.post('/', async(request, response,next) => {  
  const likes = request.body.likes ? request.body.likes : 0
  
  const blog = new Blog({...request.body,likes})
  debugger
  const result = await blog.save()
 
  response.status(201).json(result)
    //catch(error=>next(error))
})

module.exports = blogsRouter