import { combineReducers } from 'redux';

import browser from './browser';
import categories from './categories';
import chat from './chat';
import currencies from './currencies';
import currentLocation from './currentLocation';
import entities from './entities';
import forms from './forms';
import modals from './modals';
import i18n from './i18n';
import placePredictions from './placePredictions';
import routing from './routing';
import paginated from './paginated';
import server from './server';
import search from './search';
import session from './session';
import shoutDraft from './shoutDraft';
import shoutSamples from './shoutSamples';
import sortTypes from './sortTypes';
import suggestions from './suggestions';
import videocalls from './videocalls';
import staticHtml from './staticHtml';

const appReducer = combineReducers({
  browser,
  categories,
  chat,
  currencies,
  currentLocation,
  entities,
  forms,
  modals,
  i18n,
  paginated,
  placePredictions,
  routing,
  search,
  server,
  session,
  shoutDraft,
  shoutSamples,
  sortTypes,
  suggestions,
  videocalls,
  staticHtml,
});
export default appReducer;
