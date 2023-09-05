const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Profile = require('../../models/Profiles');
const { check, validationResult } = require('express-validator');

// route  get api/profile/me
// desc   get current user profile
// access private

router.get('/me' , auth, async (req, res) => {
    try {
        //to get the user profile
       const profile= await Profile.findOne({ user: req.user.id }).populate( 'user', ['name', 'avatar']);

       //to check if user exsist
       if(!profile){
        return res.status(500).json({ msg: 'There is no profile for the User'})
       }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// route  get api/profile
// desc   create or update User Profile
// access Private

module.exports = router;