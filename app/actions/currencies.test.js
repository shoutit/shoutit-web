import { expect } from 'chai';
import { CURRENCIES } from '../schemas';

import * as currencies from '../actions/currencies';

describe('actions/currencies', () => {

  describe('loadCategories', () => {
    const action = currencies.loadCurrencies({
      query: {
        foo: 'bar',
      },
      endpoint: 'baz',
    });
    it('should call the currencies service', () => {
      expect(action).to.have.deep.property('service.name', 'currencies');
    });
    it('should use the CURRENCIES schema', () => {
      expect(action).to.have.deep.property('service.schema', CURRENCIES);
    });
  });

});
