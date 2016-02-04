/**
 * Created by Philip on 22.06.2015.
 */

module.exports = function (client, path) {
        return function (session, id, query) {
          return client.get(path + "/" + id + "/messages", {
            query: query,
            accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
};
