import { Schema, arrayOf } from 'normalizr';
import { denormalize as denormalizer } from 'denormalizr';

const Category = new Schema('categories', { idAttribute: 'slug' });
const Conversation = new Schema('conversations');
const Currency = new Schema('currencies', { idAttribute: 'code' });
const Message = new Schema('messages');
const Shout = new Schema('shouts');
const Suggestions = new Schema('suggestions', { idAttribute: 'slug' });
const Tag = new Schema('tags');
const User = new Schema('users');
const DiscoverItem = new Schema('discoverItems');

Category.define({ mainTag: Tag });

Shout.define({
  category: Category,
  user: User,
  profile: User,
});

Suggestions.define({
  users: arrayOf(User),
  shouts: arrayOf(Shout),
  tags: arrayOf(Tag),
  shout: Shout,
});

Message.define({
  user: User,
  profile: User,
});

Conversation.define({
  profiles: arrayOf(User),
  about: Shout,
  lastMessage: Message,
});

DiscoverItem.define({
  children: arrayOf(DiscoverItem),
});

export const Schemas = {
  CATEGORIES: arrayOf(Category),
  CONVERSATION: Conversation,
  CONVERSATIONS: arrayOf(Conversation),
  CURRENCIES: arrayOf(Currency),
  DISCOVERITEM: DiscoverItem,
  DISCOVERITEMS: arrayOf(DiscoverItem),
  MESSAGE: Message,
  MESSAGES: arrayOf(Message),
  PROFILE: User,
  PROFILES: arrayOf(User),
  SHOUT: Shout,
  SHOUTS: arrayOf(Shout),
  SUGGESTIONS: {
    users: arrayOf(User),
    shouts: arrayOf(Shout),
    tags: arrayOf(Tag),
    shout: Shout,
  },
  TAG: Tag,
  TAGS: arrayOf(Tag),
  USER: User,
};

export const denormalize = (entity, entities, name) => denormalizer(entity, entities, Schemas[name]);
