/* eslint-env mocha */
import { expect } from 'chai';
import { createSessionFromAPIResponse } from "./SessionUtils"; // eslint-disable-line

describe('utils/SessionUtils', () => {
  describe('createSessionFromAPIResponse', () => {
    it('should merge session data into request', () => {
      const req = { session: { cookie: {} } };
      const data = {
        profile: { foo: 'bar' },
        accessToken: 'abc',
        refreshToken: 'xyz',
      };
      createSessionFromAPIResponse(req, data);
      expect(req.session.user).to.eql({ foo: 'bar' });
      expect(req.session.accessToken).to.eql('abc');
      expect(req.session.refreshToken).to.eql('xyz');
    });
    it('should throw if session is not ready', () => {
      const req = { };
      function fun() {
        createSessionFromAPIResponse(req, {});
      }
      expect(fun).to.throw;
    });
  });
});
