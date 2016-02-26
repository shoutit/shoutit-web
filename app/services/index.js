
export const twilio = {
  name: "twilio",
  read: function(req, resource, params, config, callback) {
    callback(null, "bar");
  }
};
