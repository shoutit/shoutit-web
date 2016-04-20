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
export const SHOUT = new Schema('shouts');
export const SHOUTS = arrayOf(SHOUT);

export const TAG = new Schema('tags');
export const TAGS = arrayOf(TAG);
export const USER = new Schema('users');
export const PROFILE = new Schema('users');
export const PROFILES = arrayOf(USER);
export const SUGGESTIONS = {
  users: arrayOf(USER),
  shouts: arrayOf(SHOUT),
  tags: arrayOf(TAG),
  shout: SHOUT,
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
  SHOUT,
  SHOUTS,
  SUGGESTIONS,
  TAG,
  TAGS,
  USER,
  PROFILE,
  PROFILES,
};

CATEGORY.define({ mainTAG: TAG });

SHOUT.define({
  category: CATEGORY,
  user: USER,
  profile: USER,
});

MESSAGE.define({
  user: USER,
  profile: USER,
});

CONVERSATION.define({
  profiles: arrayOf(USER),
  about: SHOUT,
  lastMessage: MESSAGE,
});

DISCOVERITEM.define({
  children: arrayOf(DISCOVERITEM),
});

export const denormalize = (entity, entities, name) => denormalizer(entity, entities, Schemas[name]);
