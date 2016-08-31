import { expect } from 'chai';
import { languages as supportedLanguages, locales as supportedLocales } from '../config';

import getInitialStoreState from './getInitialStoreState';

describe('store/getInitialStoreState', () => {

  it('should set the routing store', () => {
    const req = {
      url: 'url',
      query: { foo: 'bar' },
      path: 'path',
      session: {},
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
      session: {},
      browser: 'a_browser',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('browser');
    expect(getInitialStoreState(req).browser).to.eql('a_browser');
  });

  it('should set the i18n store', () => {
    const req = {
      session: { language: 'en' },
      locale: 'en_US',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('i18n');
    expect(state.i18n).to.have.property('messages');
    expect(state.i18n).to.have.property('currentLanguage', 'en');
    expect(state.i18n).to.have.property('currentLocale', 'en_US');
    expect(state.i18n).to.have.property('rtl', false);
    expect(state.i18n).to.have.property('supportedLocales', supportedLocales);
    expect(state.i18n).to.have.property('supportedLanguages', supportedLanguages);
  });

  it('should set the i18n store (rtl)', () => {
    const req = {
      session: { language: 'ar' },
      locale: 'ar_AR',
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('i18n');
    expect(state.i18n).to.have.property('messages');
    expect(state.i18n).to.have.property('currentLanguage', 'ar');
    expect(state.i18n).to.have.property('currentLocale', 'ar_AR');
    expect(state.i18n).to.have.property('rtl', true);
  });

  it('should set the user in the session store and in the entities', () => {
    const req = {
      session: {
        profile: {
          id: 'user_id',
          name: 'user_name',
        },
      },
    };
    const state = getInitialStoreState(req);
    expect(state).to.have.property('session');
    expect(state.session).to.have.deep.property('profile').to.equal('user_id');
    expect(state.entities.users).to.eql({
      user_id: {
        id: 'user_id',
        name: 'user_name',
      },
    });
  });

});
