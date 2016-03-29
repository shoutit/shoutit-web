export default function (client, path) {
  return function (session, username, patch) {
    return client.patch(path + '/' + username, {
      accessToken: session && session.accessToken ? session.accessToken : null,
      data: JSON.stringify(patch),
    });
  };
}
