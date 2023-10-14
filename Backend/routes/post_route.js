const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostModel = mongoose.model('PostModel');
const protectedRoute = require('../middlewares/protectedResource');

// all users posts (not logged in)
router.get('/allposts', (req, res) => {
    PostModel.find()
        .populate("author", "_id fullName profileImg")               // get details about each author
        .populate("comments.commentedBy", "_id fullName profileImg")   // get details about who commented on this
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts });
        })
        .catch((err) => {
            console.log(error);
        })
});

// all posts of one logged in user
router.get('/myallposts', protectedRoute, (req, res) => {
    PostModel.find({ author: req.user._id })    // req.user._id - logged in user's _id
        .populate("author", "_id fullName profileImg")               // get details about each author
        .then((dbPosts) => {
            res.status(200).json({ posts: dbPosts });
        })
        .catch((err) => {
            console.log(error);
        })
});

// creating a new posts by the user
router.post('/createpost', protectedRoute, (req, res) => {    // added protectedRoute middleware
    const { description, location, image } = req.body;
    if (!description || !location || !image) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    req.user.password = undefined;    // then password will not be saved in the database
    const postObj = new PostModel({ description: description, location: location, image: image, author: req.user });   // req.user - from protectedResource.js "req.user = dbUser;   // attach user data to dbUser"  this line
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

// Delete route internshala video -  working (now working)
router.delete('/deletepost/:postId', protectedRoute, async (req, res) => {
    await PostModel.findOne({ _id: req.params.postId })       // checking if post exists or not
        .populate("author", "_id")                 // check if the person deleting the post is author of the post
        .then((postFound) => {            // execute the
            if (!postFound) {
                return res.status(400).json({ error: "Post does not exist" });
            }
            // check if the post auther is same as logged in user only then allow to delete
            if (postFound.author._id.toString() === req.user._id.toString()) {         // if the post found, then use auther _id compare to user _id which is in protectedRoute _id       // 👆 - logged in user's _id
                postFound.deleteOne()                       // if matched above condition - remove
                    .then((data) => {
                        res.status(200).json({ success: "Post deleted successfully!", result: data });     // send result
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
        .catch((error) => {
            console.log(error);
        })
})


// Delete a particular post by a particular user (logged in)  (using google Bard) - working
// router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
//     try {
//         const postFound = await PostModel.findOne({ _id: req.params.postId })  // checking if post exists or not
//             .populate("author", "_id");        // check if the person deleting the post is author of the post

//         if (!postFound) {
//             throw new Error("Post does not exist");
//         }

//         // check if the post author is same as loggedin user only then allow deletion
//         if (postFound.author._id.toString() === req.user._id.toString()) { // if the postFound, then use auther _id compare to user _id which is in protectedRoute _id
//             await postFound.deleteOne();        // if matched above condition - remove
//             res.status(200).json({ success: "Post deleted successfully!", result: postFound });       // send result
//         } else {
//             throw new Error("You are not authorized to delete this post");
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// });


// Like the post (In postman object pass "postId": "post's id in database")
router.put('/like', protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {     // find the post by _id and update (here we need to pass postId of the post(from postman))
        $push: { likes: req.user._id }       // likes - from post_model.js, req.user - from protectedRoute.js (middleware)
    }, {               // 👆 - logged in user's _id
        new: true      // returns the updated object (record) after the like counted or updated
    }).populate("author", "_id fullName")
        .then((result) => {
            return res.status(200).json({ success: "Liked successfully!", result: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err });
        })
});

// Unlike the post (In postman object pass "postId": "post's id in database")
router.put('/unlike', protectedRoute, (req, res) => {
    PostModel.findByIdAndUpdate(req.body.postId, {     // find the post by _id and update (here we need to pass postId of the post(from postman))
        $pull: { likes: req.user._id }       // likes - from post_model.js, (req.user - from protectedRoute.js (middleware) (logged in user))
    }, {                 // 👆 - logged in user's _id
        new: true      // returns the updated object (record) after the unlike counted or updated
    }).populate("author", "_id fullName")
        .then((result) => {
            return res.status(200).json({ success: "Unlike successful!", result: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err });
        })
});

// comments on the post (In postman object pass "postId": "post's id in database")
router.put('/comment', protectedRoute, (req, res) => {

    const comment = { commentText: req.body.commentText, commentedBy: req.user._id }    // req.user._id (is the logged in user)
                                                                      // 👆 - logged in user's _id
    PostModel.findByIdAndUpdate(req.body.postId, {     // find the post by _id and update (here we need to pass postId of the post(from postman))
        $push: { comments: comment }       // comments - from post_model.js, req.user - from protectedRoute.js (middleware)
    }, {
        new: true      // returns the updated object (record) after the unlike counted or updated
    }).populate("author", "_id fullName")
        .then((result) => {
            return res.status(200).json({ success: "Commented By " + req.user.fullName, result: result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: err });
        })
});



module.exports = router;

