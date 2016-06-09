/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'superagent';

import * as LocationUtils from './LocationUtils';

describe('utils/LocationUtils', () => {
  describe('createLocationSlug', () => {

    it('should create the slug from a full location', () => {
      const slug = LocationUtils.createLocationSlug({
        country: 'IT',
        state: 'Sardegna',
        city: 'Bortigiadas (OT)',
      });
      expect(slug).to.equal('it_sardegna_bortigiadas-ot');
    });

    it('should create the slug from a location missing data', () => {
      const slug = LocationUtils.createLocationSlug({
        country: 'IT',
        city: 'Bortigiadas (OT)',
      });
      expect(slug).to.equal('it_no-state_bortigiadas-ot');
    });

    it('should create the slug from an empty location', () => {
      const slug = LocationUtils.createLocationSlug({});
      expect(slug).to.equal('no-country_no-state_no-city');
    });
  });

  describe('parseGeocoderResult', () => {
    it('should include rounded latitude and longitude', () => {
      const result = { geometry: { location: { lat: 10.123456789, lng: 20.123456789 } } };
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('latitude', 10.123457);
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('longitude', 20.123457);
    });
    it('should include the country', () => {
      const result = {
        addressComponents: [
          { shortName: 'IT', types: ['country'] },
        ],
      };
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('country', 'IT');
    });
    it('should include the city', () => {
      const result = {
        addressComponents: [
          { longName: 'Rome', types: ['locality'] },
        ],
      };
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('city', 'Rome');
    });
    it('should include the state', () => {
      const result = {
        addressComponents: [
          { longName: 'Lazio', types: ['administrative_area_level_1'] },
        ],
      };
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('state', 'Lazio');
    });
  });

  describe('geocodePlace', () => {
    afterEach(() => Request.prototype.end.restore());
    it('should return the first result', () => {
      sinon.stub(Request.prototype, 'end', done => done(null, {
        ok: true,
        body: {
          status: 'OK',
          results: [
            { addressComponents: [
              { longName: 'Lazio', types: ['administrative_area_level_1'] },
              { longName: 'Rome', types: ['locality'] },
              { shortName: 'IT', types: ['country'] },
            ] },
            { abc: 'xyz' }] },
      }));

      const callback = sinon.spy();

      LocationUtils.geocodePlace('AB', 'en', callback);

      expect(callback).to.have.been.calledWith(null, {
        city: 'Rome', country: 'IT', latitude: null, longitude: null, state: 'Lazio', slug: 'it_lazio_rome',
      });
    });
  });

  describe('getCountryName', () => {
    it('should return the country name for the given code', () => {
      expect(LocationUtils.getCountryName('IT')).to.equal('Italy');
    });
  });

  describe('getCountryCode', () => {
    it('should return the country code for the given country name', () => {
      expect(LocationUtils.getCountryCode('italy')).to.equal('it');
    });
    it('should return null if country is not found', () => {
      expect(LocationUtils.getCountryCode('foo')).to.be.null;
    });
  });

  describe('getLocationPath', () => {
    it('should return the path with country', () => {
      expect(LocationUtils.getLocationPath({ country: 'IT' })).to.equal('/it');
    });
    it('should return the path with country and state', () => {
      expect(LocationUtils.getLocationPath({ country: 'IT', state: 'Lazio' })).to.equal('/it/lazio');
    });
    it('should return the path with the country, state and city', () => {
      expect(LocationUtils.getLocationPath({ country: 'IT', state: 'Lazio', city: 'Roma' })).to.equal('/it/lazio/roma');
    });
    it('should work with invalid locations', () => {
      // without country
      expect(LocationUtils.getLocationPath({ state: 'Lazio', city: 'Roma' })).to.equal('');
      // unexisting country
      expect(LocationUtils.getLocationPath({ country: 'xx', state: 'Lazio', city: 'Roma' })).to.equal('');
      // without state
      expect(LocationUtils.getLocationPath({ country: 'it', city: 'Roma' })).to.equal('/it');
    });
  });

  describe('formatLocation', () => {
    it('should return a string with the location without the address', () => {
      const location = {
        address: 'Via Roma',
        postal_code: '10100',
        city: 'Rome',
        state: 'Lazio',
        country: 'IT',
      };
      expect(LocationUtils.formatLocation(location)).to.equal('Rome, Lazio, Italy');
    });
    it('should use the address', () => {
      const location = {
        address: 'Via Roma',
        postal_code: '10100',
        city: 'Rome',
        state: 'Lazio',
        country: 'IT',
      };
      expect(LocationUtils.formatLocation(location, { useAddress: true })).to.equal('Via Roma, 10100, Rome, Lazio, Italy');
    });
    it('should skip state if the same as the city', () => {
      const location = {
        city: 'Berlin',
        state: 'Berlin',
        country: 'DE',
      };
      expect(LocationUtils.formatLocation(location)).to.equal('Berlin, Germany');
    });
  });

});
