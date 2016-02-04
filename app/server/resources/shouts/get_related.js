

module.exports = function (client, path) {
  return function (session, id) {
    return client.get(path + "/" + id + "/related?page_size=3", {
        accessToken: session && session.accessToken ? session.accessToken : null
      });
  };
};
