const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

const config = {
  facebookId: "1151546964858487",
  ga: "",
  apiUrl: "https://dev-api-shoutit-com-qm7w6bwy42b2.runscope.net/v3/",
  publicUrl: `http://${host}:${port}`,
  siteUrl: `http://${host}:${port}`
};

export default config;
