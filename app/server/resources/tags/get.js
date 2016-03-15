export default function (client, path) {
  return function (session, tagName) {
    return client.get(path + "/" + tagName, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
