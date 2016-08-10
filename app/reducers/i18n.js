const initialState = {
  locale: 'en',
  supportedLocales: ['en'],
  messages: {},
  rtl: false,
};

export default function (state = initialState) {
  return state;
}

export const getCurrentLocale = state => state.i18n.locale;
export const getIntlMessages = state => state.i18n.messages;
export const isRtl = state => state.i18n.rtl;
export const getSupportedLocales = state => state.i18n.supportedLocales;
