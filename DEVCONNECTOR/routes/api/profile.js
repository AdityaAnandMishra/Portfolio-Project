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
router.post('/', [
    auth , 
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
 ],
 async (req,res)=>{
     const error = validationResult(req);
     if (!error.isEmpty()){
        return res.status(400).json({ errors: error.array() });
     }

     const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
     } = req.body;

     //build Profile object
     const profileField = {};
     profileField.user = req.user.id;
     if(company) profileField.company = company;
     if(website) profileField.website = website;
     if(location) profileField.location = location;
     if(bio) profileField.bio = bio;
     if(status) profileField.status = status;
     if(githubusername) profileField.githubusername = githubusername;
     if(skills) {
        profileField.skills = skills.split(',').map(skill => skill.trim());
    }

    //bulid social object
    profileField.social = {}
    if (youtube) profileField.social.youtube = youtube
    if (twitter) profileField.social.twitter = twitter;
    if (instagram) profileField.social.instagram = instagram;
    if (linkedin) profileField.social.linkedin = linkedin;
    if (facebook) profileField.social.facebook = facebook;

    try {
        
        let profile = Profile.findOne({ user: req.user.id })
        if(profile){
            //update the user profile
            profile = await Profile.findByIdAndUpdate(
                { user: req.user.id },
                { $set: profileField},
                { new: true }  
            );

            return res.json(profile);
        }

        //create the new user profile
        profile = new Profile(profileField);

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

 } 

);

module.exports = router;