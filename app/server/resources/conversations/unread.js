export default function (client, path) {
  return function (session, id) {
    return client.del(path + '/' + id, {
      accessToken: session && session.accessToken ? session.accessToken : null,
    });
  };
}
