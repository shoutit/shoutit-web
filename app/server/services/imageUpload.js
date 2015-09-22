/**
* Image Uplaod Service
*
* Handling image uploads and deletes from web-app to AWS-S3
*/
var multer  = require("multer"),
	Imagemin = require("imagemin"),
	os = require("os"),
	fs = require('fs'),
    path = require('path'),
	Promise = require('bluebird'),
    gm = require('gm').subClass({imageMagick: true}),
    s3Uploader = require("./s3Uploader");

var fileSettings = {};  // multer settings namespace

var FILE_SIZE_LIMIT = 5242880, // 5MB
    FILE_NUMBER_LIMIT = 7,
    TEMP_UPLOAD_DIR = os.tmpdir() + "/shoutit_images/",
    TEMP_COMPRESSED_DIR = os.tmpdir() + "/shoutit_compressed/",
    IMAGE_FORMATS = ['image/jpeg', 'image/png'],  // standard image mime-types
    FIELD_NAME = "shout_image",  // HTML form field name
    S3_CDN = "https://shout-image.static.shoutit.com",
    S3_BUCKET_NAME = "shoutit-shout-image-original",
    S3_VARIATIONS_BUCKET = "shoutit-shout-image";  // bucket name for other image sizes

var s3Config = {
    bucketName: S3_BUCKET_NAME,
    cdnURL: S3_CDN
};

// Multer file upload settings
fileSettings.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        var name = file.originalname;

        var extPos = name.search(/\..{3}$/i);
        var ext = extPos !== -1 ? name.slice(extPos, name.length) : '.jpg';

        cb(null, Date.now() + '-' + req.session.user.id + ext);
    }
});

fileSettings.limits = {
    fileSize: FILE_SIZE_LIMIT,
    files: FILE_NUMBER_LIMIT,
    fields: 20
};

fileSettings.filter = function (req, file, cb) {
    var isMatched = IMAGE_FORMATS.some(function (val) {
        return val === file.mimetype;
    });

    cb(null, isMatched);
};

var upload = multer({
    storage: fileSettings.storage,
    fileFilter: fileSettings.filter,
    limits: fileSettings.limits
}).single(FIELD_NAME);

var checkDir = function () {
    try {
        if (!fs.lstatSync(TEMP_UPLOAD_DIR).isDirectory()) {
            fs.mkdirSync(TEMP_UPLOAD_DIR);
        }
    } catch (e) {
        fs.mkdirSync(TEMP_UPLOAD_DIR);
    }
    try {
        if (!fs.lstatSync(TEMP_COMPRESSED_DIR).isDirectory()) {
            fs.mkdirSync(TEMP_COMPRESSED_DIR);
        }
    } catch (e) {
        fs.mkdirSync(TEMP_COMPRESSED_DIR);
    }
};

var removeFromTmp = function (imageName) {
    var uploadPath = TEMP_UPLOAD_DIR + imageName;
    var compressedPath = TEMP_COMPRESSED_DIR + imageName;
    // Deleting asynchronously
    fs.unlink(uploadPath, function (err) {
        if (err) console.error(err);
    });
    fs.unlink(compressedPath, function (err) {
        if (err) console.error(err);
    });
};

var convertToJPG = function (fileAddr) {
    var ext = path.extname(fileAddr);
    if (ext.toLowerCase() === '.jpg') {
        return Promise.resolve(fileAddr);
    } else {
        var newFileAddr = fileAddr.replace(ext, '.jpg');
        return new Promise(function (resolve, reject) {
            gm(fileAddr)
                .background('white')
                .setFormat('jpg')
                .write(newFileAddr, function (err) {
                    console.log("Finished saving", err);
                    // Delete original file
                    fs.unlink(fileAddr, function (err) {
                        if (err) console.error(err);
                    });
                    if (!err) {
                        resolve(newFileAddr);
                    } else {
                        reject(err);
                    }
                });
        });
    }
};

var compressImage = function (fileAddr) {
    return new Promise(function (resolve, reject) {
        new Imagemin()
            .src(fileAddr)
            .dest(TEMP_COMPRESSED_DIR)
            .use(Imagemin.jpegtran({progressive: true}))
            .run(function (err, files) {
                if (err) {
                    reject(err);
                } else {
                    resolve(files[0].path);
                }
            });
    });
};

var addImage = function (req, res) {
    if (req.session.user) {
        // check if folders exists
        checkDir();
        upload(req, res, function (err) {
            if (err) {
                console.error(err);
                res.status(400).send('Bad Request');
            } else if (req.file) {
                convertToJPG(req.file.path) // only if applicable
                    .then(compressImage)
                    .then(function (imagePath) {
                        // Uploading to S3
                        s3Uploader.add(imagePath, s3Config)
                            .then(function (s3Link) {
                                var fileName = path.basename(imagePath);
                                removeFromTmp(fileName);
                                res.send(s3Link);
                            });
                    });
            }
        });
    } else {
        console.error('un-Authorized access');
    }
};

var removeImagesFromS3 = function (req, res) {
    var fileName = req.body[FIELD_NAME];
    var uuid = req.session.user.id;
    var variation = {
        small: fileName.replace(/\./, "_small."),
        medium: fileName.replace(/\./, "_medium."),
        large: fileName.replace(/\./, "_large.")
    };

    if (fileName.indexOf(uuid) !== -1) {
        // remove original
        s3Uploader.remove(fileName, S3_BUCKET_NAME);
        // remove from variations bucket
        for (var size in variation) {
            s3Uploader.remove(variation[size], S3_VARIATIONS_BUCKET);
        }
    }
};


module.exports = {
    add: addImage,
    remove: removeImagesFromS3
};