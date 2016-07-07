import { combineReducers } from 'redux';

import categories from './entities/categories';
import conversations from './entities/conversations';
import currencies from './entities/currencies';
import discoverItems from './entities/discoverItems';
import messages from './entities/messages';
import notifications from './entities/notifications';
import shouts from './entities/shouts';
import sortTypes from './entities/sortTypes';
import tags from './entities/tags';
import users from './entities/users';

export default combineReducers({
  categories,
  conversations,
  currencies,
  discoverItems,
  messages,
  notifications,
  shouts,
  sortTypes,
  tags,
  users,
});
