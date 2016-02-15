
export default function (client, path) {
  return (session, query, options) =>
    client.get(`${path}/geocode?latlng=${query.latlng}`, options);
}
