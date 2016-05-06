import { expect } from 'chai';
import * as actionTypes from './actionTypes';

describe('actions/actionTypes', () => {
  it('should export action types', () => {
    expect(Object.keys(actionTypes)).to.have.length.above(0);
  });
});
