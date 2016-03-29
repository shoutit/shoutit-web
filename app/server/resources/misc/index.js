
import currencies from './currencies';
import categories from './categories';
import shoutSortTypes from './shoutSortTypes';
import geocode from './geocode';
import suggestions from './suggestions';
import ShuffleCategories from './ShuffleCategories';

export default function () {
  return {
    currencies: currencies(this, 'misc'),
    sortTypes: shoutSortTypes(this, 'misc'),
    categories: categories(this, 'misc'),
    geocode: geocode(this, 'misc'),
    suggestions: suggestions(this, 'misc'),
    shuffleCategories: ShuffleCategories(this, 'misc')
  };
}
