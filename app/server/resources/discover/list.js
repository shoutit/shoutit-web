/**
 * List DiscoverItems based on country query param.
 */
module.exports = function (client, path) {
    return function (session, country) {
        return client.get(path, {
            query: {country: country}
        });
    };
};
