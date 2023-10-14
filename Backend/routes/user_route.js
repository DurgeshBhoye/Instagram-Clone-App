const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const bcryptjs = require("bcryptjs");             // for password encryption and decryption (hash and compare)
const jwt = require('jsonwebtoken');        // for token based authentication (jwt token authentication)

const { JWT_SECRET_KEY } = require('../config');   // from confi.js file

// different routes

// Signup API or route
router.post('/signup', (req, res) => {
    const { fullName, email, password, profileImg } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not (if exists user already through error) and (if not exists save user in database)
    UserModel.findOne({ email: email })  // here first email is from user_model.js and second email is from req.body above
        .then((userInDB) => {       // if successful
            if (userInDB) {
                return res.status(500).json({ error: 'User with this email already exists!' });
            }
            bcryptjs.hash(password, 16)
                .then((hashedpassword) => {
                    const user = new UserModel({ fullName, email, password: hashedpassword, profileImg });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ result: 'User signed up successfully!' });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })


})

// -------------------------------------Login API (without) JWT token authentication-----------------------------------------

// // Login API (without) JWT token authentication
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
//     }

//     // checking weather user exists in database or not
//     UserModel.findOne({ email: email })  // here first email is from user_model.js and second email is from req.body above
//         .then((userInDB) => {       // if successful
//             if (!userInDB) {
//                 return res.status(401).json({ error: 'Invalid Credentials! User not found.' });   // unauthorized access or user (status 401) - if email is not in database
//             }
//             bcryptjs.compare(password, userInDB.password)      // change hash to "compare" to compare the password with encrypted password  // change 16 with userInDB(followed by .password to access password property in database) above (check line if successful)
//                 .then((didMatch) => {
//                     if (didMatch) {
//                         return res.status(200).json({ result: 'User login successful!' });   // status 200 (means ok)
//                     }
//                     else {
//                         return res.status(401).json({ error: 'Invalid Credentials! Encrypted password did not matched!' });   // if not matched password
//                     }
//                 })
//                 .catch((err) => {          // if error in comparing password
//                     console.log(err);
//                 })
//         })
//         .catch((error) => {                // if error
//             console.log(error);
//         })

// })



// ---------------------------------Login API with JWT Token (JWT used)--------------------------------

// Once a user is logged in and authenticated, and when we don't want to login again and again using id and password, for this we have to use to use token based authentication. for this we need to use JWT token authentication

// we only create the token, when the user is logged in successfully

// Login API with JWT token authentication
router.post('/auth/login', (req, res) => {             //   "/auth" - only to know jwt token authentication used
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'One or more mandatory fields are empty!' });
    }

    // checking weather user exists in database or not
    UserModel.findOne({ email: email })  // here first email is from user_model.js and second email is from req.body above
        .then((userInDB) => {       // if successful
            if (!userInDB) {
                return res.status(401).json({ error: 'Invalid Credentials! User not found.' });   // unauthorized access or user (status 401) - if email is not in database
            }
            bcryptjs.compare(password, userInDB.password)      // change hash to "compare" to compare the password with encrypted password  // change 16 with userInDB(followed by .password to access password property in database) above (check line if successful)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET_KEY);  // _id from user in database
                        const userInfo = { "email": userInDB.email, "fullName": userInDB.fullName, "_id": userInDB._id }   // extra information of the user (don't include password)
                        
                        return res.status(200).json({ result: { message: 'User login successful with JWT token!', token: jwtToken, user: userInfo } });   // token will return jwt token and user will return userInfo stored in above variable
                        // token - use this token to authoraize in the future or in create post header-> (key) authorization -> (value) this full token string in the ouput
                    }
                    else { 
                        return res.status(401).json({ error: 'Invalid Credentials! Encrypted password did not matched!' });   // if not matched password
                    }
                })
                .catch((err) => {          // if error in comparing password
                    console.log(err);
                })
        })
        .catch((error) => {                // if error
            console.log(error);
        })

})







module.exports = router;
