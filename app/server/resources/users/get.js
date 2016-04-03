export default function (client, path) {
  return function (session, username) {
    return client.get(path + '/' + username, {
      accessToken: session && session.accessToken ? session.accessToken : null,
    });
  };
}
