export default function (client, path) {
  return function (session, id) {
    return client.get(path + `/${id}/call`, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
