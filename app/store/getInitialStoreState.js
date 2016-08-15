import path from 'path';
import { locales as supportedLocales, languages as supportedLanguages } from '../config';

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
  if (req.language) {
    messages = require(`${translationsPath}/${req.language}.json`);
  }
  const state = {
    routing: {
      currentUrl: req.url,
      query: req.query,
      path: req.path,
    },
    browser: req.browser,
    currentLocation: req.geolocation,
    i18n: {
      messages,
      supportedLocales,
      supportedLanguages,
      currentLanguage: req.language,
      currentLocale: req.locale,
      rtl: req.language === 'ar',
    },
  };
  if (req.session && req.session.user) {
    const { user } = req.session;
    state.session = {
      user: user.id,
    };
    state.entities = {
      users: {
        [user.id]: user,
      },
    };
  }
  return state;
}
