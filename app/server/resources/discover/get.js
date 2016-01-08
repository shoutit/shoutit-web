/**
 * Retrieve both discover items and discover shouts
 */

module.exports = function (client, path) {
    return function (session, pk, retrieveShouts) {
        var requestURL = path + '/' + pk;
        if(retrieveShouts) {
            requestURL += '/shouts';
        }
        return client.get(requestURL, {
            accessToken: session && session.accessToken ? session.accessToken : null
        });
    };
};
