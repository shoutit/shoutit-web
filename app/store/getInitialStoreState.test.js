import { expect } from 'chai';
import { locales as supportedLocales } from '../config';

import getInitialStoreState from './getInitialStoreState';

describe('store/getInitialStoreState', () => {

  it('should set the routing store', () => {
    const req = {
      url: 'url',
      query: { foo: 'bar' },
      path: 'path',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('routing');
    expect(state.routing).to.eql({
      currentUrl: 'url',
      query: { foo: 'bar' },
      path: 'path',
    });
  });

  it('should set the browser store', () => {
    const req = {
      browser: 'a_browser',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('browser');
    expect(getInitialStoreState(req).browser).to.eql('a_browser');
  });

  it('should set the i18n store', () => {
    const req = {
      locale: 'en',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('i18n');
    expect(state.i18n).to.have.property('messages');
    expect(state.i18n).to.have.property('locale', 'en');
    expect(state.i18n).to.have.property('rtl', false);
    expect(state.i18n).to.have.property('supportedLocales', supportedLocales);
  });

  it('should set the i18n store (rtl)', () => {
    const req = {
      locale: 'ar',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('i18n');
    expect(state.i18n).to.have.property('messages');
    expect(state.i18n).to.have.property('locale', 'ar');
    expect(state.i18n).to.have.property('rtl', true);
    expect(state.i18n).to.have.property('supportedLocales', supportedLocales);
  });

  it('should set the user in the session store and in the entities', () => {
    const req = {
      session: {
        user: {
          id: 'user_id',
          name: 'user_name',
        },
      },
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('session');
    expect(state.session).to.have.property('user');
    expect(state.session.user).to.equal('user_id');
    expect(state.entities.users).to.eql({
      user_id: {
        id: 'user_id',
        name: 'user_name',
      },
    });
  });

});
