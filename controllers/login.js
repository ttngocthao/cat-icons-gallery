const loginRouter = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

loginRouter.post('/',async(req,res)=>{
    /**
     *? get email and password from req.body
     *? check if email exists
     *? check password matches
     *? if email and password are correct, generates token with the response
     */
    const body = req.body
    const user =await User.findOne({email:body.email})
    const passwordCorrect = user===null ? false : await bcrypt.compare(body.password,user.passwordHash)
    if(!user){
         return res.status(401).json({error:'invalid email '})
    }
    if(!passwordCorrect){
        return res.status(401).json({error:'invalid email or password'})
        //throw Error('Invalid username or password')
    }

    //use username and id info to generate token
    const userForToken ={
        username: user.username,
        id: user._id,
        email:user.email
    }

    const token = jwt.sign(userForToken,process.env.TOKEN_SECRET)

    res.status(200).send({token,username: user.username,email: user.email})
})

module.exports = loginRouter