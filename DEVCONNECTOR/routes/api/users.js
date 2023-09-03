const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users')

// route  get api/users
// desc   register the user
// access public

router.post('/' , [
    check('name', 'You need to enter your Name').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Your password should be of 6 or more Character').isLength({ min: 6 }),

],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const{name , email , password} = req.body; //we are destructuring the body object

    try{
    //see if the user exsists
    let user = await User.findOne({ email });

    if(user){
        return res.status(400).json({ errors: [{msg : 'User already exsists'}]})
    }

    //get the user gravatar
    const avatar= gravatar.url(email ,{
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    })

    //encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password= await bcrypt.hash(password, salt);

    await user.save();

    //return jsonwebtoken
    const payload={
        user:{
            id: user.id
        }
    };

    jwt.sign(
        payload,
        config.get('jwtToken'),
        { expiresIn: 360000 },
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
    );

    res.send('User registered');
    }

    catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }   
}
) ;

module.exports = router;