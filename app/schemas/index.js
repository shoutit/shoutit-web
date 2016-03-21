import { Schema, arrayOf } from "normalizr";
import { denormalize as denormalizer } from "denormalizr";

const Category = new Schema("categories", { idAttribute: "slug" });
const Conversation = new Schema("conversations");
const Currency = new Schema("currencies", { idAttribute: "code" });
const Message = new Schema("messages");
const Shout = new Schema("shouts");
const Suggestion = new Schema("suggestions", { idAttribute: "slug" });
const Tag = new Schema("tags");
const User = new Schema("users");

Category.define({ mainTag: Tag });

Shout.define({
  category: Category,
  user: User,
  profile: User
});

Suggestion.define({
  users: arrayOf(User),
  shouts: arrayOf(Shout),
  tags: arrayOf(Tag),
  shout: Shout
});

Message.define({
  user: User,
  profile: User
});

Conversation.define({
  users: arrayOf(User),
  profiles: arrayOf(User),
  about: Shout,
  lastMessage: Message
});

export const Schemas = {
  MESSAGE: Message,
  CONVERSATION: Conversation,
  CONVERSATIONS: arrayOf(Conversation),
  CATEGORIES: arrayOf(Category),
  CURRENCIES: arrayOf(Currency),
  MESSAGES: arrayOf(Message)
};

export const denormalize = (entity, entities, name) => denormalizer(entity, entities, Schemas[name]);
