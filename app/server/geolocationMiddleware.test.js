/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import geolocationMiddleware from './geolocationMiddleware';

const mockLocation = { country: 'IT', state: 'Lazio', city: 'Rome', slug: 'it_lazio_rome' };

describe('geolocationMiddleware', () => {
  it('should first use the geolocation of the logged profile', () => {
    const req = {
      session: { user: { location: mockLocation } },
      cookies: { location: mockLocation },
    };
    geolocationMiddleware(req, null, () => {});
    expect(req.geolocation).to.eql(mockLocation);
  });
  it('should get the geolocation from the location cookie', () => {
    const locationCookie = JSON.stringify(mockLocation);
    const req = {
      session: { user: null },
      cookies: { location: locationCookie },
    };
    geolocationMiddleware(req, null, () => {});
    expect(req.geolocation).to.eql(mockLocation);
  });

  it('should get the geolocation from the client\'s remote address', done => {
    const req = { headers: {}, connection: {} };

    sinon.stub(Request.prototype, 'end', function callback(callback) {
      expect(this.qs).to.eql({ latlng: '0,0' });
      callback(null, { body: mockLocation });
    });

    geolocationMiddleware(req, null, function next() {
      expect(req.geolocation).to.eql(mockLocation);
      done();
    });

    Request.prototype.end.restore();

  });

  it('should pass latlng as 0,0 when getting geolocation from remote address', done => {
    const req = { headers: {}, connection: {} };
    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.qs).to.eql({ latlng: '0,0' });
      done();
    });
    geolocationMiddleware(req, null, () => {});
    Request.prototype.end.restore();
  });

  it('should pass the x-forwarded-for header to get the geolocation', done => {
    const req = {
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    };

    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.header).to.have.property('x-forwarded-for', '127.0.0.1');
      done();
    });
    geolocationMiddleware(req, null, () => {});
    Request.prototype.end.restore();

  });
});
