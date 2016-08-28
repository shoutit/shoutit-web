

import { expect } from 'chai';
import request from './request';

describe('request', () => {

  it('should set Accept-Language header from req object', () => {
    const req = request.get('/foo').use({ session: { language: 'it' } });
    expect(req.header['Accept-Language']).to.equal('it');
  });

  it('should set Authorization-Page-Id header from req object', () => {
    const req = request.get('/foo').use({ session: { page: { id: 'foo' } } });
    expect(req.header['Authorization-Page-Id']).to.equal('foo');
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
