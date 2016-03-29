export default function (client, path) {
  return function (session, username) {
    return client.del(path + '/' + username, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
