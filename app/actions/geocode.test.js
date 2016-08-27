import { expect } from 'chai';

import * as geocode from '../actions/geocode';

describe('actions/geocode', () => {

  describe('geocodeCoordinates', () => {
    const action = geocode.geocodeCoordinates({ latitude: 'foo', longitude: 'bar' });
    it('should call the geocode service', () => {
      expect(action).to.have.deep.property('service.name', 'geocode');
    });
    it('should pass the correct query to the service', () => {
      expect(action).to.have.deep.property('service.params.query.latlng', 'foo,bar');
    });
  });

});
