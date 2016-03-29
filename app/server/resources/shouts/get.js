export default function (client, path) {
  return function (session, id) {
    return client.get(path + '/' + id, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
