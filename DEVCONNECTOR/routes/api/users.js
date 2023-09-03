const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// route  get api/users
// desc   register the user
// access public

router.post('/' , [
    check('name', 'You need to enter your Name').not().isEmpty(),
    check('email','Please include a valid email').isEmail(),
    check('password','Your password should be of 6 or more Character').isLength({ min: 6 }),

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send('users route')
    console.log(res.body)
}) ;

module.exports = router;