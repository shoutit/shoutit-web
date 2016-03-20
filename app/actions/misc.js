
import * as actionTypes from "./actionTypes";
import { Schemas } from "../schemas";

export function loadCategories() {
  return {
    service: {
      name: "categories",
      types: [
        actionTypes.LOAD_CATEGORIES_START,
        actionTypes.LOAD_CATEGORIES_SUCCESS,
        actionTypes.LOAD_CATEGORIES_FAILURE
      ],
      schema: Schemas.CATEGORIES
    }
  };
}

export function loadCurrencies() {
  return {
    service: {
      name: "currencies",
      types: [
        actionTypes.LOAD_CURRENCIES_START,
        actionTypes.LOAD_CURRENCIES_SUCCESS,
        actionTypes.LOAD_CURRENCIES_FAILURE
      ],
      schema: Schemas.CURRENCIES
    }
  };
}
