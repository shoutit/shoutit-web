import kebabCase from 'lodash/string/kebabCase';

export function createLocationSlug({ country = 'no-country', state = 'no-state', city = 'no-city' }) {
  return `${kebabCase(country)}_${kebabCase(state)}_${kebabCase(city)}`;
}
