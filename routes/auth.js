const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')


//Register
router.post('/register', async (req,res)=>{
    // //validate before creating user
    // const {error} = schema.validate(req.body)
    // // res.send(error.details[0].message)
    // if(error) return (res.status(400).send(error.details[0].message))
    const{error} = registerValidation(req.body)
    if(error) return (res.status(400).send(error.details[0].message))

 ///else
    //check if user already registered
    const emailExists = await User.findOne({email: req.body.email})
    if(emailExists) return (res.status(400).send('Email already exists'))

    //get stuff from req
    const { name, email, password} = req.body;

    //hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create a new user
    
    const user = new User({
        name, email, password : hashedPassword
    })
        // res.send(console.log(req.body))
    try{
        const savedUser = await user.save()
        res.send({user: user.id})

    } catch(err){
        res.status(400).send(err)
    }
})


//LOGIN 
router.post('/login', async (req,res) => {
    //validate data
    const{error} = loginValidation(req.body)
    if(error) return (res.status(400).send(error.details[0].message))

    //check if email exists
    const userfound = await User.findOne({email: req.body.email})
    if(!userfound) return (res.status(400).send('Email is not found!'))
    
    //if password is correct
    const validPass = await bcrypt.compare(req.body.password, userfound.password)
    if(!validPass) return (res.status(400).send('Invalid Password'))

    //Create and assign a token
    const token = jwt.sign({_id: userfound._id}, process.env.TOKEN_SECRET )
    res.header('auth-token', token).send(token)

    // res.send('Success LOGGED IN Selmon Bhoi')



})



module.exports = router