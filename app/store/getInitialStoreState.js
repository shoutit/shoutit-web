import path from 'path';
import { LOCALES as supportedLocales, LANGUAGES as supportedLanguages } from '../config';

const translationsPath = path.resolve(__dirname, '../../assets/intl/translations');

/**
 * Return an initial store state according to the express request.
 * Use this function only on the server to get the state to rehydrate on the client.
 *
 * @export
 * @param {any} req
 * @return {Object}
 */
export default function getInitialStoreState(req) {
  let messages;
  if (req.session.language) {
    messages = require(`${translationsPath}/${req.session.language}.json`);
  }
  const state = {
    routing: {
      currentUrl: req.url,
      query: req.query,
      path: req.path,
    },
    browser: req.browser,
    currentLocation: req.session.currentLocation,
    i18n: {
      messages,
      supportedLocales,
      supportedLanguages,
      currentLanguage: req.session.language,
      currentLocale: req.locale,
      rtl: req.session.language === 'ar',
    },
  };
  if (req.session && req.session.profile) {
    state.session = {
      profile: req.session.profile.id,
    };
    state.entities = {
      users: {
        [req.session.profile.id]: req.session.profile,
      },
    };
    if (req.session.page) {
      state.session.page = req.session.page.id;
      state.entities.users[req.session.page.id] = req.session.page;
    }
  }
  return state;
}
