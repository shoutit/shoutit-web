export default function (client, path) {
  return function (session, data) {
    return client.json('POST', path, data, {
      accessToken: session && session.accessToken ? session.accessToken : null,
    });
  };
}
