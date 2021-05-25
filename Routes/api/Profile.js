const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../Modules/Profile");
const User = require("../../Modules/User");
const config = require('config');
const { check, validationResult } = require("express-validator");
const { request } = require("express");
const requestIt = require('request');


//Check if profile exists or not
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            "user",
            ["name", "avatar"]
        );
        if (!profile) return res.status(400).send("No profile for this user");

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//show all profiles
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//find profile
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        res.json(profile);

        if (!profile) return res.status(400).json({ msg: "Profile not found" });
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" });
        }
        console.error(err.message);
        res.status(500).send("server error");
    }
});

//delete account
router.delete("/", auth, async (req, res) => {
    await Profile.findOneAndDelete({ user: req.user.id });
    await Profile.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "Account deleted Successfully" });
});

//enter profile
router.post(
    "/",
    [
        auth,
        [
            check("status", "status is required").not().isEmpty(),
            check("skills", "skills is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ error: errors.array() });

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
        } = req.body;

        //profile object created
        const profileFields = {}
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        if (skills) profileFields.skills = skills.split(',').map(skills => skills.trim());
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;

        //social object created
        profileFields.social = {}

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        try {

            //find and update
            let profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                await profile.save();
                return res.json(profile);
            }

            //create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile)

        } catch (err) {
            console.error(err);
            res.status(500).send("server error");
        }
    }
);

//Enter experience
router.put("/experience", [auth, [
    check("title", "Title cannot be empty").not().isEmpty(),
    check("company", "Title cannot be empty").not().isEmpty(),
    check("from", "from date is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    const {
        title,
        company,
        from,
        to,
        location,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        from,
        to,
        location,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});


//delete experience
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne(req.user.id);
        let removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});


//enter education
router.put("/education", [auth, [
    check("school", "school is required").not().isEmpty(),
    check("degree", "degree is required").not().isEmpty(),
    check("fieldofstudy", "field of study is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json({ errors: errors.array() });
    let {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    let newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).send("server error");
    }
});


//delete education
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne(req.user.id);
        let removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});


//get github repo
router.get("/github/:username", async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('ClientID')}&client_secret_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node:js' }
        };
        requestIt(options, (errors, response, body) => {
            if(errors) return console.error(errors);
            if(response.statusCode !== 200) return res.status(404).json({'msg' : 'Github profile not found'});

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("server error");
    }
});

module.exports = router;