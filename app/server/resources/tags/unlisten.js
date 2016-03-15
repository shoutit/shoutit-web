export default function (client, path) {
  return function (session, tagName) {
    return client.del(path + "/" + tagName + "/listen", {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
