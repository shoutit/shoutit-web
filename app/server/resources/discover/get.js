/**
 * Retrieve both discover items and discover shouts
 */

module.exports = function (client, path) {
  return function (session, pk, query) {
    var requestURL = path + "/" + pk;
    return client.get(requestURL, {
      query: query,
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
};
