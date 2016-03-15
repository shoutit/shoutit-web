import get from "./get";
import list from "./list";
export default function () {
  return {
    get: get(this, "discover"),
    list: list(this, "discover")
  };
}
