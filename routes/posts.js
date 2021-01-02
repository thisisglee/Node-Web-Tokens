const router = require('express').Router()
const User = require('../model/User')
const verify = require('./verifyToken')

router.get('/', verify , async (req, res)=> {
    res.json({
        posts: {
            title: 'my first post',
            description: 'Random data that oncly Selmon Bhoi can access'
        }
    })
    console.log(req.user._id)
    // console.log(User)
    const query = await User.findOne({_id: req.user._id});
    console.log(query.name)

})

module.exports = router