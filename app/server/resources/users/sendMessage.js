export default function (client, path) {
  return function (session, username, data) {
    return client.json("POST", path + "/" + username + "/message", data, {
      accessToken: session && session.accessToken ? session.accessToken : null,
    });
  };
}
