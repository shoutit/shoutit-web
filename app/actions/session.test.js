/* eslint-env mocha, browser */
import { expect } from 'chai';

import * as session from './session';
import { PROFILE } from '../schemas';
import * as actionTypes from '../actions/actionTypes';
import { shoutit_login, gplus_code, facebook_access_token } from '../constants/grantTypes';

const MIXPANEL_ID = 'MIXPANEL_ID';

describe('actions/session', () => {

  before(() => {
    window.mixpanel = {
      get_distinct_id: () => MIXPANEL_ID,
    };
  });

  after(() => delete window.mixpanel);

  describe('login', () => {
    it('should return the right action types', () => {
      const action = session.login({});
      expect(action.types[0]).to.equal(actionTypes.LOGIN_START);
      expect(action.types[1]).to.equal(actionTypes.LOGIN_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.LOGIN_FAILURE);
    });
    it('should pass the right arguments to the service', () => {
      const action = session.login({ foo: 'bar' });
      expect(action.service).to.have.property('name', 'session');
      expect(action.service).to.have.property('method', 'create');
      expect(action.service).to.have.property('schema', PROFILE);
      expect(action.service.body).to.have.property('mixpanel_distinct_id', MIXPANEL_ID);
      expect(action.service.body).to.have.property('foo', 'bar');
    });
    it('should use the default grant_type', () => {
      const action = session.login({ foo: 'bar' });
      expect(action.payload).to.have.property('grant_type', shoutit_login);
    });
    it('should use the given grant_type', () => {
      const action = session.login({ grant_type: 'foo', foo: 'bar' });
      expect(action.payload).to.have.property('grant_type', 'foo');
    });
  });

  describe('signup', () => {
    it('should return the right action types', () => {
      const action = session.signup({});
      expect(action.types[0]).to.equal(actionTypes.SIGNUP_START);
      expect(action.types[1]).to.equal(actionTypes.SIGNUP_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.SIGNUP_FAILURE);
    });
    it('should pass the right arguments to the service', () => {
      const action = session.signup({ foo: 'bar' });
      expect(action.service).to.have.property('name', 'profile');
      expect(action.service).to.have.property('method', 'create');
      expect(action.service).to.have.property('schema', PROFILE);
      expect(action.service.body).to.have.property('mixpanel_distinct_id', MIXPANEL_ID);
      expect(action.service.body).to.have.property('foo', 'bar');
    });
  });

  describe('clientLogin', () => {
    it('should return the LOGIN_SUCCESS action type', () => {
      expect(session.clientLogin({})).to.have.property('type', actionTypes.LOGIN_SUCCESS);
    });
    it('should return an action with the payload parsable by the entities middleware', () => {
      const profile = { foo: 'bar', id: 'ABC' };
      const action = session.clientLogin(profile);
      expect(action.payload).to.have.property('result', 'ABC');
      expect(action.payload.entities.users).to.have.property('ABC', profile);
    });
  });

  describe('loginWithGoogle', () => {
    it('should pass the right body to the service', () => {
      const action = session.loginWithGoogle('foo');
      expect(action.service.body).to.have.property('grant_type', gplus_code);
      expect(action.service.body).to.have.property('gplus_code', 'foo');
    });
  });

  describe('loginWithFacebook', () => {
    it('should pass the right body to the service', () => {
      const action = session.loginWithFacebook('foo');
      expect(action).to.have.deep.property('service.body.grant_type', facebook_access_token);
      expect(action).to.have.deep.property('service.body.facebook_access_token', 'foo');
    });
  });

  describe('logout', () => {
    it('should return the right action types', () => {
      const action = session.logout();
      expect(action.types[0]).to.equal(actionTypes.LOGOUT);
      expect(action.types[1]).to.equal(actionTypes.LOGOUT_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.LOGOUT_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.logout();
      expect(action.service).to.have.property('name', 'session');
      expect(action.service).to.have.property('method', 'delete');
    });
  });

  describe('resetPassword', () => {
    it('should return the right action types', () => {
      const action = session.resetPassword('foo@example.com');
      expect(action.types[0]).to.equal(actionTypes.PASSWORD_RESET_START);
      expect(action.types[1]).to.equal(actionTypes.PASSWORD_RESET_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.PASSWORD_RESET_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.resetPassword('foo@example.com');
      expect(action.service).to.have.property('name', 'resetPassword');
      expect(action.service).to.have.property('method', 'create');
      expect(action.service.body).to.have.property('email', 'foo@example.com');
    });
  });

  describe('setPassword', () => {
    it('should return the right action types', () => {
      const action = session.setPassword('pass', 'token');
      expect(action.types[0]).to.equal(actionTypes.PASSWORD_SET_START);
      expect(action.types[1]).to.equal(actionTypes.PASSWORD_SET_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.PASSWORD_SET_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.setPassword('pass', 'token');
      expect(action.service).to.have.property('name', 'setPassword');
      expect(action.service).to.have.property('method', 'create');
      expect(action.service.body).to.have.property('newPassword', 'pass');
      expect(action.service.body).to.have.property('resetToken', 'token');
    });
  });

  describe('sendEmailVerification', () => {
    it('should return the right action types', () => {
      const action = session.sendEmailVerification('foo@example.com');
      expect(action.types[0]).to.equal(actionTypes.SEND_EMAIL_VERIFICATION_START);
      expect(action.types[1]).to.equal(actionTypes.SEND_EMAIL_VERIFICATION_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.SEND_EMAIL_VERIFICATION_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.sendEmailVerification('foo@example.com');
      expect(action.service).to.have.property('method', 'create');
      expect(action.service).to.have.property('name', 'emailVerification');
      expect(action.service.params).to.have.property('email', 'foo@example.com');
    });
  });

  describe('verifyEmail', () => {
    it('should return the right action types', () => {
      const action = session.verifyEmail('token');
      expect(action.types[0]).to.equal(actionTypes.VERIFY_EMAIL_START);
      expect(action.types[1]).to.equal(actionTypes.VERIFY_EMAIL_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.VERIFY_EMAIL_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.verifyEmail('a_token');
      expect(action.service).to.not.have.property('method');
      expect(action.service).to.have.property('name', 'emailVerification');
      expect(action.service.params).to.have.property('token', 'a_token');
    });
  });

  describe('resetErrors', () => {
    it('should return the right action type', () => {
      const action = session.resetErrors();
      expect(action).to.have.property('type', actionTypes.RESET_SESSION_ERRORS);
    });
  });

  describe('updateLinkedAccount', () => {
    it('should return the right action types', () => {
      const action = session.updateLinkedAccount('token');
      expect(action.types[0]).to.equal(actionTypes.UPDATE_LINKED_ACCOUNT_START);
      expect(action.types[1]).to.equal(actionTypes.UPDATE_LINKED_ACCOUNT_SUCCESS);
      expect(action.types[2]).to.equal(actionTypes.UPDATE_LINKED_ACCOUNT_FAILURE);
    });
    it('should return the right service payload', () => {
      const action = session.updateLinkedAccount({ foo: 'bar' });
      expect(action.service).to.have.property('name', 'profileLink');
      expect(action.service).to.have.property('method', 'update');
      expect(action.service.body).to.have.property('foo', 'bar');
    });
  });

});
