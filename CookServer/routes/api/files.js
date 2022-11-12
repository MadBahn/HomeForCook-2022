const express = require("express");
const router = express.Router();
const multer = require("multer");

// Write the router here.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.info(req, file, cb);
        cb(null, 'files');
    },
    filename: function (req, file, cb) {
        const s = (file.originalname.split('.'));
        cb(null, file.fieldname+"-"+Date.now()+"."+s[s.length-1]);
    }
});

const upload = multer({storage:storage});

router.post("/upload_file", upload.any('file'), function (req, res) {
    res.send(req.files);
});
/*
返回值格式：
{
    "fieldname": "File",
    "originalname": "86764134970a304eaba9fc2794c8a786cb175cc9.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "files",
    "filename": "File-1665538418574.jpg",
    "path": "files\\File-1665538418574.jpg",
    "size": 15174
}


*/


module.exports = router;