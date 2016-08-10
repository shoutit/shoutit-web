import path from 'path';
import { locales as supportedLocales } from '../config';

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
  const { locale = 'en' } = req;
  const messages = require(`${translationsPath}/${locale}.json`);
  const state = {
    routing: {
      currentUrl: req.url,
      query: req.query,
      path: req.path,
    },
    browser: req.browser,
    currentLocation: req.geolocation,
    i18n: {
      supportedLocales,
      messages,
      locale,
      rtl: locale === 'ar',
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
