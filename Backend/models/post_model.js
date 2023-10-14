const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;    // from mongoose datatypes

const postSchema = new mongoose.Schema({       // schema for post creation

    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: "UserModel"        // to know who likes the post (user)
        }
    ],
    comments: [
        {
            commentText: String,
            commentedBy: {
                type: ObjectId,
                ref: "UserModel"                // to know who commented on the post (user)
            }
        }
    ],
    image: {
        type: String,
        required: true
    },
    author: {                   // this particular author created this particular post
        type: ObjectId,
        ref: "UserModel"                 // reference to UserModel ObjectId
    }

});

mongoose.model('PostModel', postSchema);