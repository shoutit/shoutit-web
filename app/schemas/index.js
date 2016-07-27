import { Schema, arrayOf } from 'normalizr';
import { denormalize as denormalizer } from 'denormalizr';

export const CATEGORY = new Schema('categories', { idAttribute: 'slug' });
export const CATEGORIES = arrayOf(CATEGORY);
export const CONVERSATION = new Schema('conversations');
export const CONVERSATIONS = arrayOf(CONVERSATION);
export const CURRENCY = new Schema('currencies', { idAttribute: 'code' });
export const CURRENCIES = arrayOf(CURRENCY);
export const DISCOVERITEM = new Schema('discoverItems');
export const DISCOVERITEMS = arrayOf(DISCOVERITEM);
export const MESSAGE = new Schema('messages');
export const MESSAGES = arrayOf(MESSAGE);
export const NOTIFICATION = new Schema('notifications');
export const NOTIFICATIONS = arrayOf(NOTIFICATION);
export const SHOUT = new Schema('shouts');
export const SHOUTS = arrayOf(SHOUT);
export const TAG = new Schema('tags');
export const TAGS = arrayOf(TAG);
export const PROFILE = new Schema('users');
export const PROFILES = arrayOf(PROFILE);
export const SORT_TYPE = new Schema('sortTypes', { idAttribute: 'type' });
export const SORT_TYPES = arrayOf(SORT_TYPE);
export const STATIC_PAGES = new Schema('staticPages');

export const SEARCH = {
  users: arrayOf(PROFILE),
  shouts: arrayOf(SHOUT),
  tags: arrayOf(TAG),
};
export const SUGGESTIONS = {
  users: arrayOf(PROFILE),
  shouts: arrayOf(SHOUT),
  tags: arrayOf(TAG),
  shout: SHOUT,
};
export const ATTACHMENT = {
  shout: SHOUT,
  profile: PROFILE,
};
export const EMAIL_VERIFICATION = {
  profile: PROFILE,
  user: PROFILE,
};
export const Schemas = {
  CATEGORY,
  CATEGORIES,
  CONVERSATION,
  CONVERSATIONS,
  CURRENCY,
  CURRENCIES,
  DISCOVERITEM,
  DISCOVERITEMS,
  MESSAGE,
  MESSAGES,
  NOTIFICATION,
  NOTIFICATIONS,
  PROFILE,
  PROFILES,
  SEARCH,
  SHOUT,
  SHOUTS,
  SORT_TYPE,
  SORT_TYPES,
  STATIC_PAGES,
  SUGGESTIONS,
  TAG,
  TAGS,
};

SHOUT.define({
  category: CATEGORY,
  user: PROFILE,
  profile: PROFILE,
  conversations: arrayOf(CONVERSATION),
});

MESSAGE.define({
  user: PROFILE,
  profile: PROFILE,
  attachments: arrayOf(ATTACHMENT),
});

PROFILE.define({
  conversation: CONVERSATION,
});

CONVERSATION.define({
  profiles: arrayOf(PROFILE),
  about: SHOUT,
  lastMessage: MESSAGE,
});

DISCOVERITEM.define({
  children: arrayOf(DISCOVERITEM),
});

export const denormalize = (entity, entities, name) => denormalizer(entity, entities, Schemas[name]);
