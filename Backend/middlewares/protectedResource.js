const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config');   // from confi.js file // for decryption of token

const mongoose = require('mongoose');   // for checking the database weather it is a valid user
const UserModel = mongoose.model('UserModel');   // schema


module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // Bearer lijfohweohwioej (random jwt token)
    if (!authorization) {
        return res.status(401).json({ error: "User not logged in or not authorized!" })
    }

    // here we will replace or say remove "Bearer<space>" from above "Bearer lijfohweohwioej" we'll get only "lijfohweohwioej" (this key)
    const token = authorization.replace("Bearer ", "");
    // this token we can get from the ouput of /auth/login (select token: "full string")
    
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
        if (error) {
            return res.status(401).json({ error: "User not logged in or not authorized! (verify error)" });
        }

        // _id - from user_route.js "const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET_KEY);" this line
        const { _id } = payload;      // same as const { _id } = payload._id;
        UserModel.findById(_id)
            .then((dbUser) => {         // dbUser is the data inside _id
                req.user = dbUser;   // attach user data to dbUser          (req.user - logged in user)  👈 IMP
                next();           // this means go to the (next middleware or response) or next callback or move forward or go to REST API...
            })
    })
}





// Important - This middleware is called before every endpoint (res API or /signup or /login like etc.)



// Note: This will stop unauthorized users from accessing the endpoint resources