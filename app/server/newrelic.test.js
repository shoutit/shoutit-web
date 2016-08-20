/* eslint import/imports-first: 0 */
import { expect } from 'chai';

process.env.NEW_RELIC_APP_NAME = 'test_new_relic';

import newrelic from './newrelic';

describe('uservoice', () => {
  it('should return the newrelic module', () => {
    expect(newrelic).to.be.defined;
  });
});
