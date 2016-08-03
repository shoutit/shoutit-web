import { getHostAndPort } from './sessionMiddleware';
import { expect } from 'chai';

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
  });
});
