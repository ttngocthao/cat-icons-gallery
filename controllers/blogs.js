const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})   

  response.status(200).json(blogs)
    
})

blogsRouter.post('/', async(request, response,next) => {  
  const blog = new Blog(request.body)
  const result = await blog.save()
 
  response.status(201).json(result)
    //catch(error=>next(error))
})

module.exports = blogsRouter