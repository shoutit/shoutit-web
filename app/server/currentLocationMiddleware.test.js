/* eslint prefer-arrow-callback: 0 */

import { expect } from 'chai';
import { Request } from 'superagent';
import sinon from 'sinon';

import currentLocationMiddleware from './currentLocationMiddleware';

const mockLocation = {
  country: 'IT',
  state: 'Lazio',
  city: 'Rome',
};

describe('server/currentLocationMiddleware', () => {
  afterEach(() => {
    if (Request.prototype.end.restore) {
      Request.prototype.end.restore();
    }
  });

  it('should use the geolocation of the logged profile', () => {
    const req = {
      url: '/',
      session: { profile: { location: mockLocation } },
      cookies: { location: mockLocation },
    };
    currentLocationMiddleware(req, null, () => {});
    expect(req.session.currentLocation).to.eql(mockLocation);
  });

  it('should get the geolocation from the location cookie', () => {
    const req = {
      url: '/',
      session: { profile: null, currentLocation: mockLocation },
    };
    currentLocationMiddleware(req, null, () => {});
    expect(req.session.currentLocation).to.eql(mockLocation);
  });

  it('should get the geolocation from the client\'s remote address', done => {
    const req = { url: '/', headers: {}, connection: {}, session: {} };

    sinon.stub(Request.prototype, 'end', function callback(callback) {
      expect(this.qs).to.eql({ latlng: '0,0' });
      callback(null, { body: mockLocation });
    });

    currentLocationMiddleware(req, null, function next() {
      expect(req.session.currentLocation).to.eql(mockLocation);
      done();
    });
  });

  it('should pass latlng as 0,0 when getting geolocation from remote address', done => {
    const req = {
      url: '/',
      headers: {},
      connection: {},
      session: {},
    };
    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.qs).to.eql({ latlng: '0,0' });
      done();
    });
    currentLocationMiddleware(req, null, () => {});
  });

  it('should pass the x-forwarded-for header to get the geolocation', done => {
    const req = {
      url: '/',
      session: {},
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    };
    sinon.stub(Request.prototype, 'end', function callback() {
      expect(this.header).to.have.property('x-forwarded-for', '127.0.0.1');
      done();
    });
    currentLocationMiddleware(req, null, () => {});
  });

  describe('search route', () => {
    it('should get country from url', () => {
      const req = {
        url: '/search/it',
        session: {},
      };
      currentLocationMiddleware(req, null, () => {});
      expect(req.session.currentLocation).to.eql({
        country: 'it',
      });
    });
    it('should get country and state from url', () => {
      const req = {
        url: '/search/it/lazio',
        session: {},
      };
      currentLocationMiddleware(req, null, () => {});
      expect(req.session.currentLocation).to.eql({
        country: 'it',
        state: 'Lazio',
      });
    });
    it('should work with encoded uri components', () => {
      const req = {
        url: '/search/it/emilia%20romagna/valeggio%20sul%20mincio?test=true',
        session: {},
      };
      currentLocationMiddleware(req, null, () => {});
      expect(req.session.currentLocation).to.eql({
        country: 'it',
        state: 'Emilia Romagna',
        city: 'Valeggio Sul Mincio',
      });
    });
  });

  describe('discover route', () => {
    it('should get country from url', () => {
      const req = {
        url: '/discover/it',
        session: {},
      };
      currentLocationMiddleware(req, null, () => {});
      expect(req.session.currentLocation).to.eql({
        country: 'it',
      });
    });
    it('should ignore state from url', () => {
      const req = {
        url: '/discover/it/lazio',
        session: {},
      };
      currentLocationMiddleware(req, null, () => {});
      expect(req.session.currentLocation).to.eql({
        country: 'it',
      });
    });
  });

});
