/**
 * List DiscoverItems based on country query param.
 */
module.exports = function (client, path) {
    return function (session, country) {
        return client.get(path, {
            country: country,
            accessToken: session && session.accessToken ? session.accessToken : null
        });
    };
};
