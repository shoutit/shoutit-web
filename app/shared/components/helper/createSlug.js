import {snakeCase} from "lodash/string";

/**
 * Make slug id for suggestion ids like "Some Name" => "some-name"
 * @param name
 * @returns {STRING}
 */
export default function createSlug(name) {
  return snakeCase(name).replace('_', '-');
};
