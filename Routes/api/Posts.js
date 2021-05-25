const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../Modules/User");
const Post = require("../../Modules/Post");
const Profile = require("../../Modules/Profile");

//Add posts

router.post('/', [auth, [
    check('text', 'text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

//Get all posts

router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);

    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

// Get post by Id

router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'likes',
            populate: {
                path: 'user',
                componets: 'user',
                select: '_id'
            }
        });
        if (!post) return res.status(404).json({ msg: "Post not found" });

        res.send(post);
    } catch (err) {
        console.error(err);
        if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//delete post

router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (!post.user.equals(req.user.id)) {
            return res.status(401).json({ msg: "User not authorised" });
        }


        await post.deleteOne({ "_id": req.params.id });

        res.send({ msg: "Post Deleted" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//like post

router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate({
            path: 'likes',
            populate: {
                path: 'user',
                componets: 'user',
                select: '_id'
            }
        });
        if (post.likes.filter(like => like.user.equals(req.user.id)).length > 0) {
            return res.status(400).send("Post already liked");
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        console.log("post.filter", post.likes.filter(like => like.user.equals(req.user.id)));
        console.log("post.likes", post.likes);
        res.json(post.likes);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

//dislike post

router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.equals(req.user.id)).length === 0)
            return res.status(400).json({ msg: "post not liked" });

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);``
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

module.exports = router;