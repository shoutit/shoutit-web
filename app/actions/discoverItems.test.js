import { expect } from 'chai';

import * as discoverItems from '../actions/discoverItems';
import { DISCOVERITEM, DISCOVERITEMS, SHOUTS } from '../schemas';

describe('actions/discoverItems', () => {

  describe('loadDiscoverItem', () => {
    const action = discoverItems.loadDiscoverItem('foo');
    it('should call the discover service', () => {
      expect(action).to.have.deep.property('service.name', 'discover');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the discoverItem id to the params', () => {
      expect(action).to.have.deep.property('service.params.id', 'foo');
    });
    it('should use the DISCOVERITEM schema', () => {
      expect(discoverItems.loadDiscoverItem({})).to.have.deep.property('service.schema', DISCOVERITEM);
    });
  });

  describe('loadDiscoverItems', () => {
    const action = discoverItems.loadDiscoverItems('it');
    it('should call the discover service', () => {
      expect(action).to.have.deep.property('service.name', 'discover');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the country to the search params to the service', () => {
      expect(action).to.have.deep.property('service.params.searchParams.country', 'it');
    });
    it('should use the DISCOVERITEMS schema', () => {
      expect(action).to.have.deep.property('service.schema', DISCOVERITEMS);
    });
  });

  describe('loadDiscoverItemShouts', () => {
    const action = discoverItems.loadDiscoverItemShouts('foo', { search: 'params' }, 'an_endpoint');
    it('should call the shouts service', () => {
      expect(action).to.have.deep.property('service.name', 'shouts');
    });
    it('should return three types', () => {
      expect(action).to.have.property('types').of.length(3);
    });
    it('should pass the search params to the service', () => {
      expect(action).to.have.deep.property('service.params.search', 'params');
    });
    it('should use the SHOUTS schema', () => {
      expect(action).to.have.deep.property('service.schema', SHOUTS);
    });
  });

});
