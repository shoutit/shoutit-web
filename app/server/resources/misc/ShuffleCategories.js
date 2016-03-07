

module.exports = function (client, path) {
  return function () {
    return client.get(path + "/categories?shuffle=1");
  };
};
