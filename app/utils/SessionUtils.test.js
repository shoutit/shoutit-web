/* eslint-env mocha */
import { now } from 'unix-timestamp';

import { expect } from 'chai';

import { didFacebookTokenExpire } from './SessionUtils';

describe('utils/SessionUtils', () => {
  describe('didFacebookTokenExpire', () => {

    it('should return `false` if Facebook is not linked', () => {
      expect(didFacebookTokenExpire({ })).to.be.false;
      expect(didFacebookTokenExpire({ linkedAccount: {} })).to.be.false;
    });

    it('should return `false` if Facebook token expiry date is newer', () => {
      const profile = {
        linkedAccount: {
          facebook: {
            expiresAt: now() + 10000,
          },
        },
      };
      expect(didFacebookTokenExpire(profile)).to.be.false;
    });

    it('should return `true` if Facebook token expiry date is older', () => {
      const profile = {
        linkedAccount: {
          facebook: {
            expiresAt: now() - 10000,
          },
        },
      };
      expect(didFacebookTokenExpire(profile)).to.be.true;
    });

  });


});
