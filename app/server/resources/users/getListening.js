export default function (client, path) {
  return function (session, username, query) {

    return client.get(path + '/' + username + '/listening', {
      accessToken: session && session.accessToken ? session.accessToken : null,
      query: query,
    });
  };
}
