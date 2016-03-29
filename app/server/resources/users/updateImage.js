import rest from 'restler';
export default function (client, path) {
  return function (session, filename, contentType, data) {
    return client.patch(path + '/me/image', {
      multipart: true,
      accessToken: session && session.accessToken ? session.accessToken : null,
      data: {
        'image_file': rest.data(filename, contentType, data)
      }
    });
  };
}
