
let assetsUrl;

export let googleMapsKey;

switch(process.env.SHOUTIT_ENV) {
case "stage":
  // To replace with the S3 URLs once the deploy process has been defined
  // eg. https://s3.amazon.com/blob_for_stage
  assetsUrl = "";
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  break;
case "develop":
  assetsUrl = "";
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  break;
case "www":
  assetsUrl = "";
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  break;
default:
  // Development
  assetsUrl = "";
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  break;
}

export const imagesPath = `${assetsUrl}/images`;
