const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../Modules/User')
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
    // make call to database
    try {
        const user = await User.findById(req.User.id).select('-password');
        res.json(user);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

router.post('/', [
    check('email', 'Email cannot be left empty').isEmail(),
    check('password', 'Password cannot be left empty').exists()],

    //Validation to if any of the above field is not as requirement, show error
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //get object properties
        const { email, password } = req.body;

        try {

            // check if user exists
            let user = await User.findOne({ email });

            //if exists then
            if (!user) return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ errors: [{ msg: 'invalid credentials' }] });

            //return jsonwebtoken
            const payload = {
                User: {
                    id: User.id
                }
            }
            let jwtSecret = config.get('jwtSecret');
            jwt.sign(payload,
                jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err
                    return res.json({ token });
                });
        }
        catch (err) {
            console.error(err);
            res.status(500).send("server error");
        }
    });

module.exports = router;