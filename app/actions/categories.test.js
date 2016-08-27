import { expect } from 'chai';
import { CATEGORIES } from '../schemas';

import * as categories from '../actions/categories';

describe('actions/categories', () => {

  describe('loadCategories', () => {
    const action = categories.loadCategories({
      query: {
        foo: 'bar',
      },
      endpoint: 'baz',
    });
    it('should call the categories service', () => {
      expect(action).to.have.deep.property('service.name', 'categories');
    });
    it('should use the CATEGORIES schema', () => {
      expect(action).to.have.deep.property('service.schema', CATEGORIES);
    });
  });

});
