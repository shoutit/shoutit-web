/* eslint-env mocha */
import { expect } from 'chai';
import { createRequestSession } from "./SessionUtils"; // eslint-disable-line

describe('SessionUtils', () => {
  describe('createRequestSession', () => {
    it('should merge session data into request', () => {
      const req = { session: { cookie: {} } };
      const data = {
        user: { foo: 'bar' },
        access_token: 'abc',
        refresh_token: 'xyz',
      };
      createRequestSession(req, data);
      expect(req.session.user).to.eql({ foo: 'bar' });
      expect(req.session.accessToken).to.eql('abc');
      expect(req.session.refreshToken).to.eql('xyz');
    });
    it('should throw if session is not ready', () => {
      const req = { };
      function fun() {
        createRequestSession(req, {});
      }
      expect(fun).to.throw;
    });
  });
});
