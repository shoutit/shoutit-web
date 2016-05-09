/* eslint no-underscore-dangle: 0 */
/* eslint-env mocha */
import { expect } from 'chai';

import { Request } from 'superagent';
import sinon from 'sinon';

import service, * as session from './session'; // eslint-disable-line

describe('services/session', () => {

  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  describe('setRequestSession', () => {
    it('should merge session data into the request object', () => {
      const req = { session: { cookie: {} } };
      const sessionData = {
        profile: { foo: 'bar' },
        accessToken: 'abc',
        refreshToken: 'xyz',
        expiresIn: 10,
      };
      session.setRequestSession(req, sessionData);
      expect(req.session.user).to.eql({ foo: 'bar' });
      expect(req.session.accessToken).to.eql('abc');
      expect(req.session.refreshToken).to.eql('xyz');
      expect(req.session.cookie.expires).to.be.greaterThan(new Date(Date.now()));
    });
  });
  describe('createRequestSession', () => {
    it('should send a API request to the right endpoint', done => {
      const req = { session: { cookie: {} } };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/oauth2/access_token');
        done();
      });
      session.createRequestSession(req, { foo: 'bar' }, () => {});
    });
    it('should send client_id and client_secret alongside other data', done => {
      const req = { session: { cookie: {} } };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this._data).to.have.property('foo', 'bar');
        expect(this._data).to.have.property('client_id');
        expect(this._data).to.have.property('client_secret');
        done();
      });
      session.createRequestSession(req, { foo: 'bar' }, () => {});
    });
    it('should set the user in the request session', done => {
      const req = { session: { cookie: {} } };
      sinon.stub(Request.prototype, 'end', callback => {
        callback(null, { body: { profile: { foo: 'bar' } } });
      });
      session.createRequestSession(req, { foo: 'bar' }, () => {
        expect(req.session.user).to.have.property('foo', 'bar');
        done();
      });
    });
    it('should send the user to the callback', done => {
      const req = { session: { cookie: {} } };
      sinon.stub(Request.prototype, 'end', callback => {
        callback(null, { body: { profile: { foo: 'bar' } } });
      });
      session.createRequestSession(req, { foo: 'bar' }, (err, user) => {
        expect(user).to.have.property('foo', 'bar');
        done();
      });
    });
  });
  describe('readSessionProfile', () => {
    it('should send a API request to the right endpoint', done => {
      const req = { };
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.url).to.contain('/profiles/me');
        done();
      });
      session.readSessionProfile(req, { foo: 'bar' }, () => {});
    });

    it('should pass the session\'s access token', done => {
      sinon.stub(Request.prototype, 'end', function callback() {
        expect(this.header).to.have.property('Authorization', 'Bearer foo');
        done();
      });
      session.readSessionProfile({ session: { accessToken: 'foo' } }, () => {});
    });

    it('should send the user to the callback', done => {
      const req = { session: { cookie: {} } };
      sinon.stub(Request.prototype, 'end', callback => {
        callback(null, { body: { foo: 'bar' } });
      });
      session.readSessionProfile(req, (err, user) => {
        expect(user).to.have.property('foo', 'bar');
        done();
      });
    });

    it('should destroy the session if the request fails', done => {
      const destroy = sinon.spy();
      const req = { session: { destroy, user: { username: 'foo' } } };
      sinon.stub(Request.prototype, 'end', callback => {
        callback('boo');
      });
      session.readSessionProfile(req, () => {
        expect(destroy).to.have.been.calledWith();
        done();
      });
    });

  });
});
