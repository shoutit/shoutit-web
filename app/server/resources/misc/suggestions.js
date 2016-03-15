export default function (client, path) {
  return function (session, query = {}) {
    return client.get(path + "/suggestions", {
      query: query,
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
