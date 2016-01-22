/**
 * List DiscoverItems based on country query param.
 */
module.exports = function (client, path) {
    return function (session, query) {
        return client.get(path, {
            query: query
        });
    };
};
