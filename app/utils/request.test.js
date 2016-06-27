/* eslint no-console: 0 */
/* eslint-env mocha */

import { expect } from 'chai';
import request from './request';

describe('request', () => {

  it('should set Accept-Language header from req object', () => {
    const req = request.get('/foo').use({ locale: 'it' });
    expect(req.header['Accept-Language']).to.equal('it');
  });

  it('should set Authorization header from req object', () => {
    const req = request.get('/foo').use({ session: { accessToken: 'foo' } });
    expect(req.header.Authorization).to.equal('Bearer foo');
  });

  it('should prefix the url', () => {
    const req = request.get('/foo').prefix('http://example.com');
    expect(req.url).to.equal('http://example.com/foo');
  });
});
