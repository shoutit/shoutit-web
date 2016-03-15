export default function (client, path) {
  return function (session, id, data) {
    return client.json("POST", path + "/" + id + "/reply", data, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
