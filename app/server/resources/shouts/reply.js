export default function (client, path) {
  return function (session, shoutId, data) {
    return client.json("POST", path + "/" + shoutId + "/reply", data, {
      accessToken: session && session.accessToken ? session.accessToken : null
    });
  };
}
