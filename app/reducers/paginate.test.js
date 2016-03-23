import { expect } from "chai";
import paginate from "./paginate";

describe("reducer/paginate", () => {

  describe("update pagination when fetching, without mapping the action's payload by key", () => {

    const reduce = paginate({
      fetchTypes: [ "FETCH_START", "FETCH_SUCCESS", "FETCH_FAILURE" ]
    });

    it("should set the state as isFetching when starting", () => {
      const state = reduce({}, {
        type: "FETCH_START",
        payload: {
          foo: "bar"
        }
      });
      expect(state).to.eql({isFetching: true});
    });

    it("should set the state when starting not changing the old state", () => {
      const state = reduce({
        ids: ["foo", "bar"],
        isFetching: false
      }, {
        type: "FETCH_START",
        payload: {
          foo: "bar"
        }
      });
      expect(state).to.eql({
        ids: ["foo", "bar"],
        isFetching: true
      });
    });

    it("should append the results when successfully fetched", () => {
      const state = reduce({
        ids: ["foo", "bar"],
        isFetching: true
      }, {
        type: "FETCH_SUCCESS",
        payload: {
          result: ["gin"]
        }
      });
      expect(state).to.eql({
        ids: ["foo", "bar", "gin"],
        isFetching: false
      });

    });

    it("should append the next/previous urls", () => {
      const state = reduce({
        ids: ["foo", "bar"],
        isFetching: true
      }, {
        type: "FETCH_SUCCESS",
        payload: {
          result: ["gin"],
          nextUrl: "next",
          previousUrl: "prev"
        }
      });
      expect(state).to.eql({
        ids: ["foo", "bar", "gin"],
        isFetching: false,
        nextUrl: "next",
        previousUrl: "prev"
      });

    });

    it("should append the error when failed fetching", () => {
      const state = reduce({
        ids: ["foo", "bar"],
        isFetching: true
      }, {
        type: "FETCH_FAILURE",
        payload: "A bad error"
      });

      expect(state).to.eql({
        ids: ["foo", "bar"],
        isFetching: false,
        error: "A bad error"
      });

    });
  });

  describe("update pagination when fetching, mapping the action's payload by key", () => {
    const reduce = paginate({
      mapActionToKey: action => action.payload.fooId,
      fetchTypes: [ "FETCH_START", "FETCH_SUCCESS", "FETCH_FAILURE" ]
    });

    it("should set the state as isFetching when starting, returning empty ids", () => {
      const state = reduce({}, {
        type: "FETCH_START",
        payload: {
          fooId: "A"
        }
      });
      expect(state).to.eql({
        A: {
          isFetching: true,
          ids: []
        }
      });
    });

    it("should append the results when successfully fetched", () => {
      const state = reduce({
        B: {
          isFetching: true,
          ids: []
        }
      }, {
        type: "FETCH_SUCCESS",
        payload: {
          fooId: "B",
          result: ["gin", "bar"]
        }
      });

      expect(state).to.eql({
        B: {
          isFetching: false,
          ids: ["gin", "bar"]
        }
      });

    });

    it("should append the next/previous urls", () => {
      const state = reduce({
        C: {
          isFetching: true,
          ids: []
        }
      }, {
        type: "FETCH_SUCCESS",
        payload: {
          fooId: "C",
          result: ["gin", "bar"],
          nextUrl: "next",
          previousUrl: "prev"
        }
      });
      expect(state).to.eql({
        C: {
          ids: ["gin", "bar"],
          isFetching: false,
          nextUrl: "next",
          previousUrl: "prev"
        }
      });

    });

    it("should append the error when failed fetchin", () => {
      const state = reduce({
        C: {
          isFetching: true,
          ids: ["gin", "bar"]
        }
      }, {
        type: "FETCH_FAILURE",
        payload: {
          message: "Bad bad things",
          fooId: "C"
        }
      });
      expect(state).to.eql({
        C: {
          ids: ["gin", "bar"],
          isFetching: false,
          error:  {
            message: "Bad bad things",
            fooId: "C"
          }
        }
      });

    });

  });

  describe("updates pagination when create action types are dispatched", () => {
    const reduce = paginate({
      mapActionToTempId: action => action.tempId,

      fetchTypes: [ "FETCH_START", "FETCH_SUCCESS", "FETCH_FAILURE" ],
      createTypes: [ "CREATE_START", "CREATE_SUCCESS", "CREATE_FAILURE" ]

    });

    it("should add the temporary item id when no state is defined", () => {
      const state = reduce(undefined, {
        type: "CREATE_START",
        tempId: "abc"
      });
      expect(state).to.eql({
        ids: ["abc"]
      });
    });

    it("should add the temporary item id when to the existing ones", () => {
      const state = reduce({ids: ["foo"]}, {
        type: "CREATE_START",
        tempId: "abc"
      });
      expect(state).to.eql({
        ids: ["foo","abc"]
      });
    });

    it("should remove the temporary item id when success", () => {
      const state = reduce({ids: ["foo", "abc"]}, {
        type: "CREATE_SUCCESS",
        tempId: "abc"
      });
      expect(state).to.eql({
        ids: ["foo"]
      });
    });

  });

  describe("updates pagination when create action types are dispatched", () => {
    const reduce = paginate({
      mapActionToTempId: action => action.tempId,
      mapActionToKey: action => action.payload.id,
      fetchTypes: [ "FETCH_START", "FETCH_SUCCESS", "FETCH_FAILURE" ],
      createTypes: [ "CREATE_START", "CREATE_SUCCESS"]

    });

    it("should add the temporary item id when no state is defined", () => {
      const state = reduce({}, {
        type: "CREATE_START",
        tempId: "temp",
        payload: {
          id: "foo"
        }
      });
      expect(state).to.eql({
        foo: {
          ids: ["temp"]
        }
      });
    });

    it("should remove the temporary item id when success", () => {
      const state = reduce({
        foo: {
          ids: ["temp"]
        }
      }, {
        type: "CREATE_SUCCESS",
        tempId: "temp",
        payload: {
          id: "foo"
        }
      });
      expect(state).to.eql({
        foo: {
          ids: []
        }
      });
    });

  });

});
