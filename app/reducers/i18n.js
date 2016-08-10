const initialState = {
  currentLocale: undefined,
  currentLanguage: undefined,
  supportedLocales: [],
  supportedLanguages: [],
  messages: {},
  rtl: false,
};

// This reducer doesn't do so much as it is hydrated from the server
export default function (state = initialState) {
  return state;
}

export const getCurrentLocale = state => state.i18n.currentLocale;
export const getCurrentLanguage = state => state.i18n.currentLanguage;
export const getSupportedLocales = state => state.i18n.supportedLocales;
export const getSupportedLanguages = state => state.i18n.supportedLanguages;
export const getIntlMessages = state => state.i18n.messages;
export const isRtl = state => state.i18n.rtl;
