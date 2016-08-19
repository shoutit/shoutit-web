import { getHostAndPort, authTokenLogin, setUserRequest } from './sessionMiddleware';
import { expect } from 'chai';
import { spy } from 'sinon';
describe('server/sessionMiddleware', () => {
  describe('getHostAndPort', () => {
    it('should return localhost:6379 as default', () => {
      expect(getHostAndPort()).to.eql({ host: 'localhost', port: 6379 });
    });
    it('should return the default if address is not valid', () => {
      expect(getHostAndPort('foo')).to.eql({ host: 'localhost', port: 6379 });
    });
    it('should return host and port from a valid address', () => {
      expect(getHostAndPort('tcp://foo:1234')).to.eql({ host: 'foo', port: 1234 });
    });
    it('should return host and port from a numeric host', () => {
      expect(getHostAndPort('tcp://10.20.30.40:1234')).to.eql({ host: '10.20.30.40', port: 1234 });
    });
  });

  describe('authTokenLogin', () => {
    it('should not redirect if auth_token is not passed via url', () => {
      const req = {
        query: { },
      };
      const res = {
        redirect: spy(),
      };
      const next = spy();
      authTokenLogin(req, res, next);
      expect(next).to.have.been.called.once;
      expect(res.redirect).to.not.have.been.called;
    });
    it('should throw if req.fetchr is not defined', () => {
      const req = {
        query: {
          auth_token: 'foo',
        },
      };
      const res = {};
      const next = () => {};
      const fn = () => authTokenLogin(req, res, next);
      expect(fn).to.throw();
    });
    it('should redirect to an url without auth_token');
    it('should redirect to an url without auth_token even if login fails');
  });

  describe('setUserRequest', () => {
    it('should skip the fetchr service if the user is already in session', () => {
      const req = {
        session: {
          user: 'foo',
        },
        fetchr: {
          read: spy(),
        },
      };
      const res = {};
      const next = spy();
      setUserRequest(req, res, next);
      expect(next).to.have.been.called.once;
      expect(req.fetchr.read).to.not.have.been.called;
    });
    it('should set the user from the service response');
  });
});
