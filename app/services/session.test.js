/* eslint no-underscore-dangle: 0 */

import { expect } from 'chai';

import { Request } from 'superagent';
import { spy, stub } from 'sinon';

import service from './session'; // eslint-disable-line

describe('services/session', () => {

  it('should have the right name', () => {
    expect(service.name).to.equal('session');
  });

  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  describe('create method', () => {
    const req = {
      session: {
        cookie: {},
        currentLocation: {
          country: 'it',
        },
      },
    };

    it('should pass the body to the request', done => {
      stub(Request.prototype, 'end', function callback() {
        expect(this._data).to.have.deep.property('profile.username', 'foo');
        expect(this._data).to.have.deep.property('profile.location.country', 'it');
        expect(this._data).to.have.property('client_id');
        expect(this._data).to.have.property('client_secret');
        done();
      });
      service.create(req, {}, {}, { profile: { username: 'foo' } });
    });

    it('should set the request session data and pass the user to the callback', done => {
      const requestCallback = spy();
      stub(Request.prototype, 'end', callback => {
        const res = {
          body: {
            profile: {
              user_name: 'a user',
            },
            new_signup: true,
            access_token: 'an_access_token',
            refresh_token: 'a_refresh_token',
            scope: 'scopeA scopeB',
            expires_in: 10,
          },
        };
        callback(null, res);
        expect(req.session).to.have.property('profile').to.eql({
          userName: 'a user',
        });
        expect(req.session).to.have.property('newSignup', true);
        expect(req.session).to.have.property('accessToken', 'an_access_token');
        expect(req.session).to.have.property('refreshToken', 'a_refresh_token');
        expect(req.session.cookie).to.have.property('expires');
        expect(req.session.scope).to.eql('scopeA scopeB');
        expect(requestCallback).to.have.been.calledWith(null, { userName: 'a user' });
        done();
      });
      service.create(req, {}, {}, { foo: 'bar' }, {}, requestCallback);
    });

  });

  describe('read method', () => {

    it('should set the user in session', done => {
      const serviceCallback = spy();
      const req = {
        session: {
          cookie: {},
          destroy: () => {},
        },
      };
      stub(Request.prototype, 'end', function cb(callback) {
        const response = {
          body: {
            user_name: 'a user',
          },
        };
        callback(null, response);
        expect(this.url).to.contain('/profiles/me');
        expect(req.session).to.have.property('profile');
        expect(req.session).to.not.have.property('page');

        expect(serviceCallback).to.have.been.calledWith(null, { userName: 'a user' });
        done();
      });
      service.read(req, {}, {}, {}, serviceCallback);
    });

    it('should set the authorization page in session', done => {
      const serviceCallback = spy();
      const req = {
        session: {
          cookie: {},
          destroy: () => {},
          authorizationPage: {
            id: 'auth_page_id',
            username: 'auth_page_username',
          },
        },
      };
      stub(Request.prototype, 'end', function cb(callback) {
        if (this.url.match(/\/profiles\/me$/)) {
          callback(null, { body: { username: 'logged_user' } });
        } else {
          const response = {
            body: {
              username: 'page',
              isOwner: true,
            },
          };
          callback(null, response);
          expect(this.url).to.contain('/profiles/auth_page_username');
          expect(req.session).to.have.property('profile');
          expect(req.session).to.have.property('page').to.eql({ username: 'page', isOwner: true });
          expect(serviceCallback).to.have.been.calledWith(null, { username: 'logged_user' });
          done();
        }
      });
      service.read(req, {}, {}, {}, serviceCallback);
    });

    it('should ignore the authorization page if not owner of the logged user', done => {
      const serviceCallback = spy();
      const req = {
        session: {
          cookie: {},
          destroy: () => {},
          authorizationPage: {
            id: 'auth_page_id',
            username: 'auth_page_username',
          },
        },
      };
      stub(Request.prototype, 'end', function cb(callback) {
        if (this.url.match(/\/profiles\/me$/)) {
          callback(null, { body: { username: 'logged_user' } });
        } else {
          const response = {
            body: {
              username: 'page',
              isOwner: false,
            },
          };
          callback(null, response);
          expect(req.session).to.not.have.property('page');
          done();
        }
      });
      service.read(req, {}, {}, {}, serviceCallback);
    });

  });

  describe('delete method', () => {
    it('should destroy the session', () => {
      const destroy = spy();
      const req = { session: { destroy, profile: { username: 'foo' } } };
      stub(Request.prototype, 'end', callback => {
        callback('boo');
      });
      service.delete(req, {}, {}, {}, () => {});
      expect(destroy).to.have.been.calledWith();
    });

  });
});
