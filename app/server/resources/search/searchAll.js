/**
 * Created by Philip on 15.04.2015.
 */


/**
 * Created by Philip on 15.04.2015.
 */

const Promise = require('bluebird');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function makePromiseFromRequest(req) {
  return new Promise(function (resolve, reject) {
    req
      .on('success', function (data) {
        resolve(data);
      })
      .on('fail', function (data, resp) {
        reject(data, resp);
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

export default function FakeClient() {
  EventEmitter.call(this);
}

util.inherits(FakeClient, EventEmitter);

FakeClient.prototype.search = function (client, session, term) {
  const shoutClient = client.shouts();
  const tagClient = client.tags();
  const userClient = client.users();

  const searchQuery = {
    search: term,
  };

  const emitter = this;

  Promise.all([
    makePromiseFromRequest(shoutClient.list(session, searchQuery)),
    makePromiseFromRequest(tagClient.search(session, searchQuery)),
    makePromiseFromRequest(userClient.search(session, term)),
  ]).spread(function (shouts, tags, users) {
    emitter.emit('complete', {
      shouts: shouts.results,
      tags: tags.results,
      users: users.results,
    }, {
      statusCode: 200,
    });
  }, function (err) {
    emitter.emit('error', err);
  });

  return this;
};
