/* eslint import/imports-first: 0 */
import { expect } from 'chai';

process.env.SENTRY_DSN = 'test_sentry';

import Raven from './raven';

describe('raven', () => {
  it('should return the Raven module', () => {
    expect(Raven).to.be.defined;
  });
});
