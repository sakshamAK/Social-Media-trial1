const config = require('config');
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

let User = require('../../Modules/User');

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email cannot be left empty').isEmail(),
    check('password', 'Password must contain atleast 6 characters').isLength({ min: 6 })],
    
    //Validation to if any of the above field is not as requirement show error
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //get object properties
        const { name, email, password } = req.body;

        try {

            // check if user exists
            let user = await User.findOne({ email });
            if (user) res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            console.log(req.body);

            //gravatar profile

            const avatar = gravatar.url(email, {
                s: '200',    //status
                r: 'pg',     //ratings pg restricts 18+ images
                d: 'mm'      //display mm means it will show a blank profile
            })

            //creating new user data to be fed to the database
            User = new User({
                name,
                email,
                avatar,
                password
            });

            // passwrod encryption
            const salt = await bcrypt.genSalt(10);
            User.password = await bcrypt.hash(password, salt);

            //save user
            await User.save();

            //return jsonwebtoken
            const payload = {
                user: {
                    id: User.id
                }
            }
            let jwtSecret = config.get('jwtSecret');
            jwt.sign(payload,
                jwtSecret,
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err
                    res.json({ token });
                });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send("server error");
        }
    });

module.exports = router;