const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/',async(req,res)=>{
    /**
     *? get username and password from req.body
     *? check if username exists
     *? check password matches
     *? if username and password are correct, generates token with the response
     */
    const body = req.body
    const user =await User.findOne({username:body.username})
    const passwordCorrect = user===null ? false : await bcrypt.compare(body.password,user.passwordHash)

    if(!user || !passwordCorrect){
        return res.status(401).json({error:'invalid username or password'})
        //throw Error('Invalid username or password')
    }

    //use username and id info to generate token
    const userForToken ={
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken,process.env.TOKEN_SECRET)

    res.status(200).send({token,username: user.username,name: user.name})
})

module.exports = loginRouter