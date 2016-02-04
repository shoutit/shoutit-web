/**
 * Created by Philip on 27.02.2015.
 */

module.exports = function(client, path) {
  return function() {
    return client
      .get(path + "/me");
  };
};
