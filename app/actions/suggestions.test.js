import { expect } from 'chai';

import * as suggestions from '../actions/suggestions';

describe('actions/suggestions', () => {

  describe('loadSuggestions', () => {
    const action = suggestions.loadSuggestions({
      query: {
        foo: 'bar',
      },
      endpoint: 'baz',
    });
    it('should call the suggestions service', () => {
      expect(action).to.have.deep.property('service.name', 'suggestions');
    });
    it('should pass the correct query to the service', () => {
      expect(action).to.have.deep.property('service.params.query.foo', 'bar');
    });
    it('should pass the endpoint to the service', () => {
      expect(action).to.have.deep.property('service.params.endpoint', 'baz');
    });
  });

});
