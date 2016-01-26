
let assetsUrl;

switch(process.env.SHOUTIT_ENV) {
case "stage":
  // To replace with the S3 URLs once the deploy process has been defined
  // eg. https://s3.amazon.com/blob_for_stage
  assetsUrl = "";
  break;
case "develop":
  assetsUrl = "";
  break;
case "www":
  assetsUrl = "";
  break;
default:
  // Development
  assetsUrl = "";
  break;
}

export const imagesPath = `${assetsUrl}/images`;
