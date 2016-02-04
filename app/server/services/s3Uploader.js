/**
 * S3Uploader - Uploading an deleting any image file to any bucket
 *
 */
var Promise = require("bluebird"),
  s3 = require("s3"),
  path = require("path");

var ACCESS_KEY = process.env.S3_ACCESS_KEY,
  SECRET_KEY = process.env.S3_SECRET_KEY;

var s3Client = s3.createClient({
  maxAsyncS3: 10,
  s3RetryCount: 3,
  s3RetryDelay: 1000,
  multipartUploadThreshold: 20971520, // (20 MB)
  multipartUploadSize: 15728640, //  (15 MB)
  s3Options: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY
  }
});

function addToS3(localFile, config) {
  var bucketName = config.bucketName,
    cdnURL = config.cdnURL,
    fileName = path.basename(localFile);

  var params = {
    localFile: localFile,
    s3Params: {
      Bucket: bucketName,
      Key: fileName
    }
  };

  return new Promise(function (resolve, reject) {
    var s3Uploader = s3Client.uploadFile(params);

    s3Uploader.on("error", function (err) {
      console.error("unable to upload:", err.stack);
      reject(err.stack);
    });
    s3Uploader.on("end", function () {
      var s3Link = cdnURL + "/" + fileName;
      resolve(s3Link);
    });
  });
}

// change 
// function addImageDataToS3(dataImage, config) {
//     var bucketName = config.bucketName,
//         cdnURL = config.cdnURL,
//         fileName = path.basename(localFile);

//     var params = {
//         localFile: localFile,
//         s3Params: {
//             Bucket: bucketName,
//             Key: fileName
//         }
//     };

//     return new Promise(function (resolve, reject) {
//         var s3Uploader = s3Client.uploadFile(params);

//         s3Uploader.on('error', function (err) {
//             console.error("unable to upload:", err.stack);
//             reject(err.stack);
//         });
//         s3Uploader.on('end', function () {
//             var s3Link = cdnURL + "/" + fileName;
//             resolve(s3Link);
//         });
//     });
// }

function removeFromS3(fileName, bucketName) {
  var params = {
    Bucket: bucketName,
    Delete: {
      Objects: [
                {Key: fileName}
      ]
    }
  };

  var res = s3Client.deleteObjects(params);
  res.on("error", function (err) {
    console.error("unable to delete:", err.stack);
  });
}

module.exports = {
  add: addToS3,
  remove: removeFromS3
};
