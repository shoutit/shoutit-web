export default function (state = { locale: 'en', messages: {} }) {
  return state;
}

export function getCurrentLocale(state) {
  return state.i18n.locale;
}

export function getIntlMessages(state) {
  return state.i18n.messages;
}

export function isRtl(state) {
  return state.i18n.locale === 'ar';
}
