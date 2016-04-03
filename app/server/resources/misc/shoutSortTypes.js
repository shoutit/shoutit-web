export default function (client, path) {
  return function () {
    return client.get(path + '/shouts_sort_types');
  };
}
