export default function (client, path) {
  return function () {
    return client
      .get(path + '/me');
  };
}
