#!/usr/bin/env node

/* eslint no-var: 0, no-console: 0 */

var s3 = require("s3");

var client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.SHOUTIT_S3_ACCESS_KEY,
    secretAccessKey: process.env.SHOUTIT_S3_SECRET_KEY,
    region: process.env.SHOUTIT_S3_REGION
  }
});

var params = {
  localDir: "public",
  s3Params: {
    Bucket: process.env.SHOUTIT_S3_BUCKET,
    Prefix: process.env.SHOUTIT_S3_BASEPATH
  }
};


const summary = [];
summary.push("");
summary.push("aws uploader");
summary.push("------------------------------------------------------------");
summary.push("");
summary.push("  Access Key:   " + process.env.SHOUTIT_S3_ACCESS_KEY);
summary.push("  Region:       " + process.env.SHOUTIT_S3_REGION);
summary.push("  Bucket:       " + process.env.SHOUTIT_S3_BUCKET);
summary.push("  Base path:    " + process.env.SHOUTIT_S3_BASEPATH);
summary.push("");

console.log(summary.join("\n"));

console.log("Uploading " +  params.localDir + "...");

var uploader = client.uploadDir(params);
uploader.on("error", function(err) {
  console.error("Unable to upload:", err.stack);
  process.exit(1);
});
uploader.on("end", function() {
  console.log("Done uploading.");
  process.exit();
});
