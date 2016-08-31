import { expect } from 'chai';
import { SORT_TYPES } from '../schemas';

import * as sortTypes from '../actions/sortTypes';

describe('actions/sortTypes', () => {

  describe('loadCategories', () => {
    const action = sortTypes.loadSortTypes({
      query: {
        foo: 'bar',
      },
      endpoint: 'baz',
    });
    it('should call the sortTypes service', () => {
      expect(action).to.have.deep.property('service.name', 'sortTypes');
    });
    it('should use the SORT_TYPES schema', () => {
      expect(action).to.have.deep.property('service.schema', SORT_TYPES);
    });
  });

});
