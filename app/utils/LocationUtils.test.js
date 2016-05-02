/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { Request } from 'superagent';

import * as LocationUtils from './LocationUtils';

describe('LocationUtils', () => {
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
          { shortName: 'Rome', types: ['locality'] },
        ],
      };
      expect(LocationUtils.parseGeocoderResult(result)).to.have.property('city', 'Rome');
    });
    it('should include the state', () => {
      const result = {
        addressComponents: [
          { shortName: 'Lazio', types: ['administrative_area_level_1'] },
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
              { shortName: 'Lazio', types: ['administrative_area_level_1'] },
              { shortName: 'Rome', types: ['locality'] },
              { shortName: 'IT', types: ['country'] },
            ] },
            { abc: 'xyz' }] },
      }));

      const callback = sinon.spy();

      LocationUtils.geocodePlace('AB', callback);

      expect(callback).to.have.been.calledWith(null, {
        city: 'Rome', country: 'IT', latitude: null, longitude: null, state: 'Lazio',
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

  describe('formatLocation', () => {
    it('should return a string with the location data', () => {
      const location = {
        address: 'Via Roma',
        postal_code: '10100',
        city: 'Rome',
        state: 'Lazio',
        country: 'IT',
      };
      expect(LocationUtils.formatLocation(location)).to.equal('Via Roma, 10100, Rome, Lazio, IT');
    });
    it('should skip state if the same as the city', () => {
      const location = {
        city: 'Berlin',
        state: 'Berlin',
        country: 'DE',
      };
      expect(LocationUtils.formatLocation(location)).to.equal('Berlin, DE');
    });
  });

});
