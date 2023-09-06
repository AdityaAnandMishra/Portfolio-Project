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

// route  post api/profile
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
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileField},
                { new: true, upsert: true , setDefaultsOnInsert: true}  
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

// route  get api/profile
// desc   get All the user
// access public

router.get('/' , async (req, res) => {
    try {
        //to get the all user profile
       const profiles= await Profile.find().populate( 'user', ['name', 'avatar']);

       res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// route  get api/profile/user/:user_id
// desc   get All the user
// access public

router.get('/users/:user_id' , async (req, res) => {
    try {
        //to get the all user profile
       const profile= await Profile.findOne({ user: req.params.user_id}).populate( 'user', ['name', 'avatar']);

       if(!profile) return res.status(400).json({ msg: ' There is no Profile for this User '});

       res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            if(!profile) return res.status(400).json({ msg: ' There is no Profile for this User '});
        }
        res.status(500).send('Server Error')
    }
});

// DELETE  get api/profile
// desc    DELETE user , profile and post
// access  private

router.delete('/' , auth ,  async (req, res) => {
    try {
        //to delete user profile
       await Profile.findOneAndRemove({ user: req.user.id });
       //to delete user
       await User.findOneAndRemove({ _id: req.user.id });

       res.json({ msg: 'User Deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// route  put api/profile/exprience
// desc   Add the Exprience of the User
// access Private
router.put('/exprience', [
    auth , 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ]
 ],
 async (req,res)=>{
     const error = validationResult(req);
     if (!error.isEmpty()){
        return res.status(400).json({ errors: error.array() });
     }

     const {
        company,
        title,
        location,
        from,
        to,
        current,
        description,
     } = req.body;

     //build Profile object
     const newExp = {
        company,
        title,
        location,
        from,
        to,
        current,
        description,
     };

    try {
        
        let profile = await Profile.findOne({ user: req.user.id })

            //update the user profile with Exprience

        profile.exprience.unshift(newExp);
            

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

 }
);

// DELETE  get api/profile/exprience/:exp_id
// desc    DELETE exprience from profile
// access  private

router.delete('/exprience/:exp_id' , auth ,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
       const removeIndex = profile.exprience.map( item => item.id).indexOf(req.params.exp_id);

       profile.exprience.splice(removeIndex, 1);

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// route  put api/profile/education
// desc   Add the education of the User
// access Private
router.put('/education', [
    auth , 
    [
        check('school', 'school is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ]
 ],
 async (req,res)=>{
     const error = validationResult(req);
     if (!error.isEmpty()){
        return res.status(400).json({ errors: error.array() });
     }

     const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
     } = req.body;

     //build Profile object
     const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
     };

    try {
        
        let profile = await Profile.findOne({ user: req.user.id })

            //update the user profile with Exprience

        profile.education.unshift(newEdu);
            

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

 }
);

// DELETE  get api/profile/exprience/:exp_id
// desc    DELETE exprience from profile
// access  private

router.delete('/education/:edu_id' , auth ,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index
       const removeIndex = profile.education.map( item => item.id).indexOf(req.params.edu_id);

       profile.education.splice(removeIndex, 1);

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;