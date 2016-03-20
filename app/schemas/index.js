import { Schema, arrayOf } from "normalizr";

export const currency = new Schema("currencies", { idAttribute: "code" });
export const currencies = arrayOf(currency);

export const category = new Schema("categories", { idAttribute: "slug" });
export const categories = arrayOf(category);

export const location = new Schema("locations", { idAttribute: "slug" });

export const user = new Schema("users");

export const shout = new Schema("shouts");

export const tag = new Schema("tags");

export const suggestion = new Schema("suggestions", { idAttribute: "slug" });
suggestion.define({
  users: arrayOf(user),
  shouts: arrayOf(shout),
  tags: arrayOf(tag),
  shout: shout
});
