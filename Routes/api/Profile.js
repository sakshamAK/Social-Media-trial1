const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const Profile = require('../../Modules/Profile');
const User = require('../../Modules/User')

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.User.id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).send("No profile for this user");
        
        res.json(profile);
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('server error');
    }
    
});

module.exports = router;