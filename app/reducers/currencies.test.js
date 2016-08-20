/* eslint-env mocha */
import { expect } from 'chai';

import reducer, { getCurrencies } from './currencies';
import * as actionTypes from '../actions/actionTypes';

describe('reducers/currencies', () => {

  describe('reducer', () => {
    it('should set the state when loading currencies', () => {
      const action = {
        type: actionTypes.LOAD_CURRENCIES_SUCCESS,
        payload: {
          result: ['A', 'B'],
        },
      };
      const state = reducer(undefined, action);
      expect(state).to.eql(['A', 'B']);
    });
  });

  describe('getCurrencies', () => {
    it('should get the currencies from entities', () => {
      const state = {
        currencies: ['A', 'B'],
        entities: {
          currencies: {
            A: { code: 'A' },
            B: { code: 'B' },
          },
        },
      };
      const expectedValue = [
        { code: 'A' },
        { code: 'B' },
      ];
      expect(getCurrencies(state)).to.eql(expectedValue);
    });
  });

});
