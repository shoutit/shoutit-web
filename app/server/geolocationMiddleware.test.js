/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import geolocationMiddleware from './geolocationMiddleware';

const mockLocation = {
  country: 'IT',
  state: 'Lazio',
  city: 'Rome',
  slug: 'it_lazio_rome',
  name: 'Rome, Lazio, Italy',
};

describe('server/geolocationMiddleware', () => {
  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  describe('search route', () => {
    it('should get country from url', () => {
      const req = {
        url: '/search/it',
      };
      geolocationMiddleware(req, null, () => {});
      expect(req.geolocation).to.eql({
        country: 'it',
        slug: 'it_no-state_no-city',
        name: 'Italy',
      });
    });
    it('should get country and state from url', () => {
      const req = {
        url: '/search/it/lazio',
      };
      geolocationMiddleware(req, null, () => {});
      expect(req.geolocation).to.eql({
        country: 'it',
        state: 'Lazio',
        slug: 'it_lazio_no-city',
        name: 'Lazio, Italy',
      });
    });
    it('should work with encoded uri components', () => {
      const req = {
        url: '/search/it/emilia%20romagna/valeggio%20sul%20mincio?test=true',
      };
      geolocationMiddleware(req, null, () => {});
      expect(req.geolocation).to.eql({
        country: 'it',
        state: 'Emilia Romagna',
        city: 'Valeggio Sul Mincio',
        slug: 'it_emilia-romagna_valeggio-sul-mincio',
        name: 'Valeggio Sul Mincio, Emilia Romagna, Italy',
      });
    });
  });

  describe('discover route', () => {
    it('should get country from url', () => {
      const req = {
        url: '/discover/it',
      };
      geolocationMiddleware(req, null, () => {});
      expect(req.geolocation).to.eql({
        country: 'it',
        slug: 'it_no-state_no-city',
        name: 'Italy',
      });
    });
    it('should ignore state from url', () => {
      const req = {
        url: '/discover/it/lazio',
      };
      geolocationMiddleware(req, null, () => {});
      expect(req.geolocation).to.eql({
        country: 'it',
        slug: 'it_no-state_no-city',
        name: 'Italy',
      });
    });
  });
  it('should ignore unexisting countries from url', () => {
    sinon.stub(Request.prototype, 'end', done => done);
    const req = {
      url: '/search/qq',
      headers: {},
      connection: {},
    };
    geolocationMiddleware(req, null, () => {});
    expect(req.geolocation).to.be.undefined;
  });
  it('should use the geolocation of the logged profile', () => {
    const req = {
      url: '/',
      session: { user: { location: mockLocation } },
      cookies: { location: mockLocation },
    };
    geolocationMiddleware(req, null, () => {});
    expect(req.geolocation).to.eql(mockLocation);
  });
  it('should get the geolocation from the location cookie', () => {
    const locationCookie = JSON.stringify(mockLocation);
    const req = {
      url: '/',
      session: { user: null },
      cookies: { location: locationCookie },
    };
    geolocationMiddleware(req, null, () => {});
    expect(req.geolocation).to.eql(mockLocation);
  });

  it('should get the geolocation from the client\'s remote address', done => {
    const req = { url: '/', headers: {}, connection: {} };

    sinon.stub(Request.prototype, 'end', function callback(callback) {
      expect(this.qs).to.eql({ latlng: '0,0' });
      callback(null, { body: mockLocation });
    });

    geolocationMiddleware(req, null, function next() {
      expect(req.geolocation).to.eql(mockLocation);
      done();
    });
  });

  it('should pass latlng as 0,0 when getting geolocation from remote address', done => {
    const req = { url: '/', headers: {}, connection: {} };
    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.qs).to.eql({ latlng: '0,0' });
      done();
    });
    geolocationMiddleware(req, null, () => {});
  });

  it('should pass the x-forwarded-for header to get the geolocation', done => {
    const req = {
      url: '/',
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    };
    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.header).to.have.property('x-forwarded-for', '127.0.0.1');
      done();
    });
    geolocationMiddleware(req, null, () => {});
  });
});
