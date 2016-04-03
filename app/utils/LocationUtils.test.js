/* eslint-env mocha */

import { expect } from 'chai';
import * as LocationUtils from './LocationUtils';

describe('LocationUtils', () => {
  describe('createLocationSlug', () => {

    it('creates a location slug from a full location', () => {
      const slug = LocationUtils.createLocationSlug({
        country: 'IT',
        state: 'Sardegna',
        city: 'Bortigiadas (OT)',
      });
      expect(slug).to.equal('it_sardegna_bortigiadas-ot');
    });

    it('creates a location slug from a location missing data', () => {
      const slug = LocationUtils.createLocationSlug({
        country: 'IT',
        city: 'Bortigiadas (OT)',
      });
      expect(slug).to.equal('it_no-state_bortigiadas-ot');
    });

    it('creates a location slug from an empty location', () => {
      const slug = LocationUtils.createLocationSlug({});
      expect(slug).to.equal('no-country_no-state_no-city');
    });
  });
});
