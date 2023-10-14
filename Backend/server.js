const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');   // importing mongoose
const app = express();
const PORT = 8080;

const { MONGO_DB_URL } = require('./config');   // from config.js file

// add global variable to get or .... path
global.__basedir = __dirname;            // __basedir - will hold the path of the base(backend) folder (reatogram-v1-backend)
// so when we go http://localhost:8080/files/avatar.jpg we can download the image (here avatar.jpg)
// search http://localhost:8080/files/avatar.jpg in browser will download the avatar.jpg image or file
// "/files" is from file_route.js file - router.get('/files/:filename', downloadFile);  - this line
// avatar.jpg is uploaded file from frontend to backend using upload post inside "/profile"
// avatar.jpg is the image name and localhost:8080 is the backend post url

// connecting to MONGODB database
mongoose.connect(MONGO_DB_URL);  // connect to database

// checking connection
mongoose.connection.on('connected', () => {
    console.log('Connection established to MongoDB');
})
// if error in connection
mongoose.connection.on('error', (error) => {
    console.log('connection error: ' + error);
})

// using cors (middleware)
app.use(cors());

// middleware for formating json responses
app.use(express.json());


// importing UserModel Schema
require('./models/user_model');   

// importing PostModel Schema
require('./models/post_model');        

app.use(require('./routes/user_route'));   // from routes/user_route.js   ( /signup and /login )

app.use(require('./routes/post_route'));   // from routes/post_route.js   ( /createpost)

app.use(require('./routes/file_route'));   // from routes/file_route.js    (for uploading files - here images only)



app.listen(PORT, (req, res) => {
    console.log(`Server Started on port ${PORT}`);
})





// token is ouput of /auth/login (get token string and )
// in postman
// go to Header
// in key -> use Authorization
// in value -> use token string (output of /auth/login)





 






























// app.get("/welcome", (req, res) => {
//     res.status(200).json({"msg": "Hey, Brother!"});
// })