const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// route  get api/auth
// desc   To login with credential
// access public

router.post('/' , [
    check('email','Please Enter your valid emailId').isEmail(),
    check('password','Enter your password').exists(),

],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const{ email , password } = req.body; //we are destructuring the body object

    try{
    //see if the user exsists
    let user = await User.findOne({ email });

    if(!user){
        return res.status(400).json({ errors: [{msg : 'Invalid Credintials'}]});
    }

    //to make sure that user we find is present in our database
    
    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        return res.status(400).json({ errors: [{msg : 'Invalid Credintials'}]});
    }

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
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }   
}
) ;

// route  get api/auth
// desc   test route
// access public

router.get('/' , auth , async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
}) ;

module.exports = router;