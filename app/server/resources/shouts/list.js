
module.exports = function (client, path) {
  return function (session, query) {
    return client.get(path, {
      query: query,
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
};
