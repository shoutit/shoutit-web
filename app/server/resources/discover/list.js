export default function (client, path) {
  return function (session, query) {
    return client.get(path, {
      query: query
    });
  };
}
