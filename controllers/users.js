const userRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { response } = require('../app')

userRouter.post('/',async(req,res)=>{
    const body = req.body

    /**
     * !Hash password
     */
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.passwordHash,saltRounds)

    const newUser = new User ({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const result = await newUser.save()

    response.status(201).json(result)

})


module.exports = userRouter