export default function (state = { locale: 'en', messages: {} }) {
  return state;
}

export function getCurrentLocale(state) {
  return state.i18n.locale;
}
