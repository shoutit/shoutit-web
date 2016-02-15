

module.exports = function (client, path) {
  return function (session, data) {
    return client.post(path + "/change_password" , {
      accessToken: session && session.accessToken ? session.accessToken : null,
      data: JSON.stringify(data)
    });
  };
};
