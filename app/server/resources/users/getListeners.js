export default function (client, path) {
  return function (session, username, page) {
    const query = {};

    if (page && !isNaN(page)) {
      query.page = page;
    }

    return client.get(path + "/" + username + "/listeners", {
      accessToken: session && session.accessToken ? session.accessToken : null,
      query: query
    });
  };
}
