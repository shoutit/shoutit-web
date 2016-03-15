export default function (client, path) {
  return function (session, username) {
    return client.post(path + "/" + username + "/listen", {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
