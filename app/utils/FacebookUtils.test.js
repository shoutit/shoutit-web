/* eslint-env mocha, browser */
import { now } from 'unix-timestamp';

import { expect } from 'chai';
import { spy } from 'sinon';

import { didTokenExpire, isScopeGranted, initFacebook } from './FacebookUtils';

describe('utils/FacebookUtils', () => {
  describe('initFacebook', () => {

    it('should not init again if the SDK is already initialized', () => {
      const init = spy();
      const callback = spy();
      window.FB = {
        init,
      };

      initFacebook(callback);
      expect(init).to.not.have.been.called;
      expect(callback).to.have.been.called;

      delete window.FB;

    });

  });
  describe('didTokenExpire', () => {
    it('should return `false` if Facebook is not linked', () => {
      expect(didTokenExpire({ })).to.be.false;
      expect(didTokenExpire({ linkedAccount: {} })).to.be.false;
    });
    it('should return `false` if Facebook token expiry date is newer', () => {
      const profile = {
        linkedAccount: {
          facebook: {
            expiresAt: now() + 10000,
          },
        },
      };
      expect(didTokenExpire(profile)).to.be.false;
    });
    it('should return `true` if Facebook token expiry date is older', () => {
      const profile = {
        linkedAccount: {
          facebook: {
            expiresAt: now() - 10000,
          },
        },
      };
      expect(didTokenExpire(profile)).to.be.true;
    });
  });

  describe('isScopeGranted', () => {
    it('should return `false` if scopes do not match', () => {
      expect(isScopeGranted('email,address', 'city,name')).to.be.false;
    });
    it('should return `false` if at least a scope is missing', () => {
      expect(isScopeGranted('email,address', 'email')).to.be.false;
    });
    it('should return `true` if scopes do match', () => {
      expect(isScopeGranted('email,address', 'address,email')).to.be.true;
    });
  });


});
