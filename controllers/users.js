const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')


userRouter.post('/',async(req,res)=>{
    const body = req.body

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password,saltRounds)

    const newUser = new User ({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const result = await newUser.save()
   
    res.status(201).json(result)

})


userRouter.get('/',async(req,res)=>{
    return 0
})

module.exports = userRouter