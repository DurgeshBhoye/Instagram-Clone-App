const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {      // file- file to be uploaded,  cd - content buffer
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,                // first storage - attribute and second storage for above function name "const storage"
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false)
            return res.status(400).json({ error: "File types allowed are .png, .jpg, .jpeg" });
        }

    }

})


// implementing upload image functionality
router.post('/uploadFile', upload.single('file'), function (req, res) {
    res.json({ "fileName": req.file.filename });
})

// implementing download file functionality
const downloadFile = (req, res) => {
    const fileName = req.params.filename;
    const path = __basedir + "/uploads/";   // path relatate to the path inside server.js file

    res.download(path + fileName, (error) => { 
        if (error) { 
            res.status(500).send({ message: "File cannot be downloaded!" + error });
        }
    })
}

router.get('/files/:filename', downloadFile);     // for uploading and downloading files


module.exports = router;




// token - use /auth/login ouput token string as value

// In postman

// Header => Key as Authorization => value as token string (in /auth/login ouput (token))