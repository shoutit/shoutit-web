import list from "./list";
import create from "./create";
import get from "./get";
import getCall from "./getCall";
import getRelated from "./get_related";

import del from "./delete";
import reply from "./reply";

export default function () {
  return {
    list: list(this, "shouts"),
    create: create(this, "shouts"),
    get: get(this, "shouts"),
    getCall: getCall(this, "shouts"),
    getRelated: getRelated(this, "shouts"),
    del: del(this, "shouts"),
    reply: reply(this, "shouts")
  };
}
