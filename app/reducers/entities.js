import { combineReducers } from 'redux';

import categories from './entities/categories';
import conversations from './entities/conversations';
import currencies from './entities/currencies';
import discoverItems from './entities/discoverItems';
import messages from './entities/messages';
import shouts from './entities/shouts';
import tags from './entities/tags';
import users from './entities/users';

export default combineReducers({
  categories,
  conversations,
  currencies,
  discoverItems,
  messages,
  shouts,
  tags,
  users,
});
