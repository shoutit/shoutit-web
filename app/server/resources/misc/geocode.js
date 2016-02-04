

module.exports = function (client, path) {
  return function (session, query) {
      return client.get(path + "/geocode?latlng=" + query.latlng);
    };
};
