let express = require('express');
var multer = require('multer');
var path = require('path');
let app = express();
var { promisify } = require('util');
var sizeOf = promisify( require('image-size'));
"use strict";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});

var upload = multer({ storage: storage });
var type = upload.single('upl');

app.post('/feta', type, async function (req, res) {
    let dimensions = await sizeOf('../uploads/' + req.file.filename);
    let sf2c = {
        cmd: 'imageSaveSuccess',
        imageId: req.file.filename,
        imageSize: dimensions
    };
    res.json(sf2c)
});

app.use('/file', express.static(path.join(__dirname, '../uploads')));
app.listen(8082, function () {console.log('web server listening on port 8082')});

module.exports = app;
