export default function (client, path) {
  return function (session, pk, query) {
    const requestURL = path + '/' + pk;
    return client.get(requestURL, {
      query: query,
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
