const {
  SHOUTIT_ENV,
  SHOUTIT_BASE_URL,
  HOST,
  PORT,
  NODE_ENV,
  REDIS_HOST,
  SHOUTIT_S3_ACCESS_KEY,
  SHOUTIT_S3_SECRET_KEY
} = process.env;

export const host = HOST || "localhost";
export const port = PORT || (NODE_ENV === "production" ? 8080 : 3000);
export const shoutitEnv = SHOUTIT_ENV || "develop";

export let baseUrl;
export let apiUrl;
export let googleMapsKey;
export let imagesPath;
export let redisHost;

export const s3AccessKey = SHOUTIT_S3_ACCESS_KEY;
export const s3SecretKey = SHOUTIT_S3_SECRET_KEY;

if (!process.env.SHOUTIT_ENV || process.env.SHOUTIT_ENV === "develop") {
  baseUrl = SHOUTIT_BASE_URL || `http://${host}:${port}`;
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  redisHost = REDIS_HOST || "localhost";
  apiUrl = "http://dev.api.shoutit.com/v2/";
}
if (process.env.SHOUTIT_ENV === "stage") {
  baseUrl = SHOUTIT_BASE_URL;
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  redisHost = REDIS_HOST || "localhost";
  apiUrl = "http://dev.api.shoutit.com/v2/";
}
if (process.env.SHOUTIT_ENV === "beta") {
  baseUrl = SHOUTIT_BASE_URL;
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  redisHost = REDIS_HOST || "localhost";
  apiUrl = "http://dev.api.shoutit.com/v2/";
}
if (process.env.SHOUTIT_ENV === "www") {
  baseUrl = SHOUTIT_BASE_URL;
  googleMapsKey = "AIzaSyBTB6-OnMETp1wjS8ZnUugqrlW5UcdEkgc";
  redisHost = REDIS_HOST || "localhost";
  apiUrl = "http://api.shoutit.com/v2/";
}

imagesPath = `${baseUrl}/images`;

export function reportWarnings() {
  const messages = [];
  if (!s3AccessKey) {
    messages.push("S3 Access Key not available, set a SHOUTIT_S3_ACCESS_KEY env variable.");
  }
  if (!s3SecretKey) {
    messages.push("S3 Secret Key not available, set a SHOUTIT_S3_SECRET_KEY env variable.");
  }
  if (!baseUrl) {
    messages.push("Base URL is not defined, set a SHOUTIT_BASE_URL env variable.");
  }
  return messages;
}
